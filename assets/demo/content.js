import {roomContent} from './profile.js';

const destinations=[
  {id:'projects',name:'Projetos',number:'01',color:'#6d85b5',x:-18,z:-12,symbol:'</>',building:{width:10.4,depth:7.4,height:7.4}},
  {id:'experience',name:'Experiência',number:'02',color:'#8e759e',x:0,z:-24,symbol:'↗',building:{width:7.8,depth:7,height:11.7}},
  {id:'about',name:'Sobre mim',number:'03',color:'#648f82',x:18,z:-12,symbol:'VV',building:{width:8,depth:8,height:9.2}},
  {id:'tech',name:'Tecnologias',number:'04',color:'#538f9c',x:-23,z:12,symbol:'{ }',building:{width:9,depth:7.2,height:8}},
  {id:'education',name:'Formação',number:'05',color:'#b38b56',x:0,z:25,symbol:'⌑',building:{width:10,depth:7.6,height:9.8}},
  {id:'contact',name:'Contato',number:'06',color:'#b87680',x:23,z:12,symbol:'@',building:{width:7.4,depth:6.6,height:8}}
];
export const houses=destinations.map(h=>({...h,...roomContent[h.id]}));
