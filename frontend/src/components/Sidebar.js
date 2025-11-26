import React, {useState} from 'react';
import { motion } from 'framer-motion';

const cities = ['Pune','Mumbai','Delhi','Bengaluru','Chennai','London','New York','Tokyo'];

export default function Sidebar({onSelectCity}){
  const [q,setQ] = useState('');
  const filtered = cities.filter(c=>c.toLowerCase().includes(q.toLowerCase()));
  return (
    <aside className="sidebar">
      <div className="logo">Weather Dashboard</div>
      <div className="search-box">
        <input placeholder="Search city..." value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={()=>{ if(q) onSelectCity(q);}}>Go</button>
      </div>
      <div className="city-list">
        {filtered.map(c=>(
          <motion.div key={c} className="city-item" whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>onSelectCity(c)}>
            {c}
          </motion.div>
        ))}
      </div>
      <div style={{marginTop:20,fontSize:13,color:'#94a3b8'}}>Quick picks</div>
    </aside>
  );
}
