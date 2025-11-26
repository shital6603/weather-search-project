import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function smallDataFromHours(){
  const arr = [];
  for(let i=0;i<8;i++){
    arr.push({time: i+'h', temp: Math.round(20 + Math.sin(i/2)*6 + Math.random()*2)});
  }
  return arr;
}

export default function Dashboard({city}){
  const [data,setData] = useState(null);
  const [status,setStatus] = useState('idle');
  const [chartData,setChartData] = useState(smallDataFromHours());

  useEffect(()=>{
    if(!city) return;
    setStatus('loading');
    axios.get(`/api/weather?city=${encodeURIComponent(city)}`)
      .then(res=>{
        setData(res.data.data);
        setStatus(res.data.cached ? 'loaded (cached)' : 'loaded (fresh)');
        // generate small chart mock from current temp
        const base = res.data.data?.main?.temp || 25;
        const cd = Array.from({length:8}).map((_,i)=>({time: i+'h', temp: Math.round(base + Math.sin(i/2)*3)}));
        setChartData(cd);
      })
      .catch(err=>{
        setStatus('error: '+ (err.response?.data?.error || err.message));
      });
  },[city]);

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:0.4}}>
      <div className="header">
        <h1>Current Weather — {city}</h1>
        <div className="muted">{status}</div>
      </div>

      <div className="cards">
        <div className="card large">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div className="muted">Location</div>
              <div style={{fontWeight:700,fontSize:18}}>{data?.name}, {data?.country}</div>
              <div className="muted">Coordinates: {data?.coord?.lat}, {data?.coord?.lon}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="temp-big">{data?.main?.temp ? Math.round(data.main.temp) + '°C' : '--'}</div>
              <div className="muted">Feels like {data?.main?.feels_like ?? '--'}°C</div>
            </div>
          </div>

          <div style={{marginTop:16, display:'flex', gap:12}}>
            <div style={{flex:1}}>
              <div className="muted">Temperature trend</div>
              <div style={{height:200}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)"/>
                    <XAxis dataKey="time" stroke="#94a3b8"/>
                    <YAxis stroke="#94a3b8"/>
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" stroke="#00b4d8" strokeWidth={3} dot={{r:3}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{width:260, display:'flex',flexDirection:'column',gap:8}}>
              <div className="small card" style={{padding:12}}>
                <div className="kv"><div className="muted">Humidity</div><div>{data?.main?.humidity ?? '--'}%</div></div>
                <div className="kv"><div className="muted">Pressure</div><div>{data?.main?.pressure ?? '--'} hPa</div></div>
                <div className="kv"><div className="muted">Wind</div><div>{data?.wind?.speed ?? '--'} m/s</div></div>
                <div className="kv"><div className="muted">Clouds</div><div>{data?.clouds?.all ?? '--'}%</div></div>
              </div>

              <div className="small card" style={{padding:12}}>
                <div className="muted">Sunrise</div>
                <div>{data?.sunrise ? new Date((data.sunrise + (data.timezone||0))*1000).toUTCString().replace('GMT','') : '--'}</div>
                <div className="muted" style={{marginTop:8}}>Sunset</div>
                <div>{data?.sunset ? new Date((data.sunset + (data.timezone||0))*1000).toUTCString().replace('GMT','') : '--'}</div>
              </div>
            </div>
          </div>

          <div className="footer">Data provided by OpenWeatherMap • Animated dashboard UI</div>
        </div>

        <div className="card">
          <div className="muted">Weather Summary</div>
          <div style={{fontSize:16,fontWeight:700,marginTop:8}}>{data?.weather?.[0]?.main ?? '--'}</div>
          <div className="muted" style={{marginTop:8}}>{data?.weather?.[0]?.description ?? ''}</div>
        </div>

        <div className="card">
          <div className="muted">Raw Data (toggle)</div>
          <pre style={{maxHeight:220,overflow:'auto',background:'rgba(255,255,255,0.02)',padding:8,borderRadius:8}}>{JSON.stringify(data?.raw ?? {}, null, 2)}</pre>
        </div>
      </div>
    </motion.div>
  );
}
