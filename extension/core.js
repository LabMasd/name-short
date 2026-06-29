// name.short — shared shortening logic (used by popup + service worker)
(function(g){
  const FILLER = new Set(['a','an','the','of','for','and','or','to','in','on','with','at','by','from','final','draft','version','copy','new','working','files','file','project','folder','assets','asset','delivery','export','exports','master','client']);
  const MONTH = ['01','02','03','04','05','06','07','08','09','10','11','12'];

  function today(){
    const d = new Date();
    return d.getFullYear()+MONTH[d.getMonth()]+String(d.getDate()).padStart(2,'0');
  }
  function tokenize(s){
    return s.replace(/[''`]/g,'')
      .split(/[^A-Za-z0-9]+/)
      .flatMap(w => w.replace(/([a-z0-9])([A-Z])/g,'$1 $2').split(' '))
      .filter(Boolean);
  }
  function stripAscii(s){
    return s.normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^\x00-\x7F]/g,'');
  }
  function applyStrategy(words, strat){
    switch(strat){
      case 'initials': return words.map(w => w[0]).join('');
      case 'truncate': return words.map(w => w.length > 4 ? w.slice(0,4) : w);
      case 'vowels':   return words.map(w => w.length > 3 ? w[0]+w.slice(1).replace(/[aeiou]/gi,'') : w);
      case 'smart':{
        let kept = words.filter(w => !FILLER.has(w.toLowerCase()) || /^\d+$/.test(w));
        return kept.length ? kept : words;
      }
      default: return words;
    }
  }
  function toCase(parts, mode){
    const arr = Array.isArray(parts) ? parts : [parts];
    const low = arr.map(w => w.toLowerCase());
    switch(mode){
      case 'kebab':  return low.join('-');
      case 'snake':  return low.join('_');
      case 'lower':  return low.join('');
      case 'upper':  return arr.map(w=>w.toUpperCase()).join('');
      case 'camel':  return low.map((w,i)=> i? w[0].toUpperCase()+w.slice(1) : w).join('');
      case 'pascal': return low.map(w=> w[0].toUpperCase()+w.slice(1)).join('');
    }
  }

  // opts: {case, strat, max, ascii, date}
  function shorten(name, opts){
    const o = Object.assign({case:'kebab',strat:'smart',max:24,ascii:true,date:'none'}, opts||{});
    let s = (name||'').trim();
    if(!s) return '';
    if(o.ascii) s = stripAscii(s);
    let words = tokenize(s);
    if(!words.length) return '';
    const result = applyStrategy(words, o.strat);
    let out = (o.strat === 'initials') ? toCase([result], o.case) : toCase(result, o.case);
    const max = parseInt(o.max) || 0;
    if(max > 0 && out.length > max) out = out.slice(0, max).replace(/[-_]+$/,'');
    const sep = o.case==='snake'?'_':(o.case==='kebab'?'-':'');
    if(o.date === 'pre')  out = today()+sep+out;
    if(o.date === 'post') out = out+sep+today();
    return out;
  }

  g.NameShort = { shorten, today };
})(typeof self !== 'undefined' ? self : this);
