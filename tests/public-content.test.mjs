import assert from 'node:assert/strict';
import {test} from 'node:test';
import {products} from '../src/config/products.ts';
import {projects} from '../src/config/projects.ts';
import {productSections} from '../src/config/productSections.ts';
import {defaultPresentation,toPublicProject} from '../src/config/publicPresentation.ts';
import {normalizeProduct,validateContent,parseAdminData,safeImage,publicContactHref} from '../src/Components/dashboards/adminModel.ts';
import {emptyWorkspace} from '../src/Components/dashboards/businessModel.ts';

const seed = p => normalizeProduct({...p,id:p.slug,logo:p.logo??'',editorialStatus:'draft',updatedAt:''});
test('the editor starts with every existing card and detail field, including screenshots and sections',()=>{
  for(const product of products){
    const item=seed(product), existing=projects.find(p=>p.slug===product.slug), output=toPublicProject(item);
    for(const key of ['name','slug','status','category','summary','sector','challenge','solution','benefit','features','images']) assert.deepEqual(output[key],existing[key]);
    assert.deepEqual(item.presentation.sections,productSections[product.slug]);
    assert.equal(item.buttonText,product.buttonText);
    assert.equal(output.buttonText,'Conocer el producto');
    assert.equal(validateContent({...item,editorialStatus:'ready'},[item]),'');
  }
});
test('editing a presentation never mutates the public defaults',()=>{
  const copy=defaultPresentation('ksoft-travel');
  copy.images[0].title='Editado'; copy.sections[0].items[0].title='Nuevo público';
  assert.notEqual(projects[0].images[0].title,'Editado');
  assert.notEqual(productSections['ksoft-travel'][0].items[0].title,'Nuevo público');
});
test('card and detail projections preserve text, cover choice and gallery order after a backup round-trip',()=>{
  const entry=seed(products[1]);
  entry.presentation.images.reverse();
  entry.presentation.cover={...entry.presentation.images[0],title:'Portada independiente'};
  entry.presentation.summary='Resumen editado';
  entry.presentation.sections[1].items[0].description='Descripción editada';
  entry.questions[0].answer='Respuesta editada';
  entry.visibility='hidden';
  const data={version:1,posts:[],products:[entry],publicProjects:[],workspace:emptyWorkspace(),activity:[]};
  const restored=parseAdminData(JSON.stringify(data));
  assert.deepEqual(restored.products[0],entry);
  const project=toPublicProject(restored.products[0]);
  assert.equal(project.summary,'Resumen editado');
  assert.equal(project.cover.title,'Portada independiente');
  assert.equal(project.images[0].src,entry.presentation.images[0].src);
});
test('incomplete ready content, invalid section structures and unsafe URLs cannot be saved',()=>{
  const entry=seed(products[0]);
  entry.editorialStatus='ready'; entry.presentation.solution='';
  assert.match(validateContent(entry,[entry]),/Completa la tarjeta/);
  entry.presentation.solution='Solución';entry.presentation.sections[1].items[0].description='';
  assert.match(validateContent(entry,[entry]),/elementos de cada sección/);
  entry.editorialStatus='draft';entry.presentation.website='javascript:alert(1)';
  assert.match(validateContent(entry,[entry]),/https/);
  entry.presentation.website='';entry.presentation.sections[0].type='unknown';
  assert.match(validateContent(entry,[entry]),/secciones/);
});
test('each screenshot needs accessible metadata, safe media and positive dimensions',()=>{
  const entry=seed(products[1]);
  entry.presentation.images[0].alt='';
  assert.match(validateContent(entry,[entry]),/texto alternativo/);
  entry.presentation.images[0].alt='Vista del panel';entry.presentation.images[0].width=0;
  assert.match(validateContent(entry,[entry]),/dimensiones/);
  entry.presentation.images[0].width=1600;entry.presentation.images[0].src='javascript:alert(1)';
  assert.match(validateContent(entry,[entry]),/dirección válida/);
});
test('only safe raster image data is accepted for local image uploads',()=>{
  assert.equal(safeImage('data:image/png;base64,aGVsbG8='),true);
  assert.equal(safeImage('data:image/svg+xml;base64,aGVsbG8='),false);
  assert.equal(safeImage('data:text/html;base64,aGVsbG8='),false);
});
test('legacy local products gain the complete existing detail without losing commercial edits',()=>{
  const old={...products[1],id:'travel',logo:products[1].logo,editorialStatus:'draft',updatedAt:'',headline:'Mi título editado'};
  const restored=parseAdminData(JSON.stringify({version:1,posts:[],products:[old],workspace:emptyWorkspace(),activity:[]}));
  assert.equal(restored.products[0].headline,'Mi título editado');
  assert.equal(restored.products[0].presentation.images.length,5);
  assert.ok(restored.products[0].presentation.sections.length>0);
});
test('public project drafts are stored independently of internal project management',()=>{
  const entry=seed(products[0]);entry.id='public-project';entry.slug='proyecto-cliente';entry.entryType='project';entry.billingModel='';
  const data={version:1,posts:[],products:[],publicProjects:[entry],workspace:emptyWorkspace(),activity:[]};
  const restored=parseAdminData(JSON.stringify(data));
  assert.equal(restored.publicProjects.length,1);
  assert.equal(restored.workspace.records.projects.length,0);
});
test('contact links preserve the pilot intent for products and avoid it for client projects',()=>{
  const entry=seed(products[1]);
  assert.equal(publicContactHref(entry),products[1].pilotHref);
  entry.contactIntent='product';assert.equal(publicContactHref(entry),'/contact?producto=ksoft-travel#contact-form');
  entry.entryType='project';assert.equal(publicContactHref(entry),'/contact#contact-form');
});
test('legacy custom products preserve their data and return to draft when their detail is incomplete',()=>{
  const old={...products[0],id:'custom',slug:'mi-producto',logo:'',editorialStatus:'ready',updatedAt:'',name:'Mi producto'};
  const restored=parseAdminData(JSON.stringify({version:1,posts:[],products:[old],workspace:emptyWorkspace(),activity:[]}));
  assert.equal(restored.products[0].name,'Mi producto');
  assert.equal(restored.products[0].editorialStatus,'draft');
});
