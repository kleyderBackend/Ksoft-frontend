import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiMessageSquare} from 'react-icons/fi';
import {teamRpc} from '../../services/teamRepository';
import styles from '../NavbarAdmin/NavbarAdmin.module.css';
export function TicketIndicator(){
 const [count,setCount]=useState(0);
 useEffect(()=>{let active=true;const refresh=()=>{if(document.hidden)return;void teamRpc<{unread:number}>('ksoft_ticket_list').then(value=>{if(active)setCount(value.unread);}).catch(()=>{/* The tickets screen exposes connection errors. */});};refresh();const timer=setInterval(refresh,60000);window.addEventListener('focus',refresh);window.addEventListener('ksoft:tickets-changed',refresh);return()=>{active=false;clearInterval(timer);window.removeEventListener('focus',refresh);window.removeEventListener('ksoft:tickets-changed',refresh);};},[]);
 return <Link className={styles.bell} to="/dashboard/tickets" aria-label={'Tickets internos: '+count+' sin leer'} title="Tickets internos"><FiMessageSquare aria-hidden="true"/>{count>0&&<span>{count>99?'99+':count}</span>}</Link>;
}
