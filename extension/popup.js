const $ = s => document.querySelector(s);
const seg = $('#date'), thumb = seg.querySelector('.thumb');
let opts = { case:'kebab', strat:'smart', max:24, ascii:true, date:'none' };

function readOpts(){
  return {
    case: $('#case').value,
    strat: $('#strat').value,
    max: $('#max').value,
    ascii: $('#ascii').checked,
    date: opts.date
  };
}

function render(){
  opts = readOpts();
  chrome.storage.local.set({ opts });
  const lines = $('#in').value.split('\n').map(l=>l.trim()).filter(Boolean);
  const out = $('#out');
  if(!lines.length){ out.innerHTML = '<div class="empty">Type some names above ↑</div>'; return; }
  out.innerHTML = '';
  lines.forEach(line => {
    const sh = NameShort.shorten(line, opts);
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<span class="short" title="${sh}">${sh}</span><span class="len">${sh.length}</span><button>copy</button>`;
    const btn = row.querySelector('button');
    btn.onclick = () => {
      navigator.clipboard.writeText(sh);
      btn.textContent='✓'; btn.classList.add('copied');
      setTimeout(()=>{btn.textContent='copy';btn.classList.remove('copied')},900);
    };
    out.appendChild(row);
  });
}

// sliding date pill with directional drag + anticipation squash
let dragTimer;
function moveThumb(btn, animate){
  const oldLeft = thumb.offsetLeft, newLeft = btn.offsetLeft;
  if(animate && newLeft !== oldLeft){
    thumb.style.transformOrigin = newLeft > oldLeft ? 'right center' : 'left center';
    thumb.style.setProperty('--sx','1.32');
    thumb.classList.add('drag');
    clearTimeout(dragTimer);
    dragTimer = setTimeout(()=>{ thumb.classList.remove('drag'); thumb.style.setProperty('--sx','1'); }, 180);
  }
  thumb.style.left = newLeft + 'px';
  thumb.style.width = btn.offsetWidth + 'px';
}
seg.addEventListener('click', e => {
  const btn = e.target.closest('button'); if(!btn) return;
  seg.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  opts.date = btn.dataset.d;
  moveThumb(btn, true); render();
});
seg.addEventListener('mouseover', e => {
  const btn = e.target.closest('button'); if(!btn || btn.classList.contains('on')) return;
  thumb.style.transformOrigin = (btn.offsetLeft > thumb.offsetLeft) ? 'left center' : 'right center';
  thumb.style.setProperty('--sx','0.9');
});
seg.addEventListener('mouseleave', ()=> thumb.style.setProperty('--sx','1'));

$('#in').addEventListener('input', render);
['case','strat','max','ascii'].forEach(id => $('#'+id).addEventListener('change', render));
$('#copyAll').onclick = () => {
  const lines = $('#in').value.split('\n').map(l=>l.trim()).filter(Boolean);
  navigator.clipboard.writeText(lines.map(l=>NameShort.shorten(l, opts)).join('\n'));
  $('#copyAll').textContent='✓ copied';
  setTimeout(()=>$('#copyAll').textContent='Copy all',900);
};
const EXAMPLES = ["Perfume Campaign Final Delivery 2026","Client Brand Identity Working Files","Untitled Project Copy Final v2","Summer Photoshoot Raw Exports","Website Redesign Master Assets"];
$('#sample').onclick = () => { $('#in').value = EXAMPLES[Math.floor(Math.random()*EXAMPLES.length)]; render(); };

// restore saved settings, then place the pill + render
chrome.storage.local.get('opts', ({opts:saved}) => {
  if(saved){
    opts = saved;
    $('#case').value = saved.case; $('#strat').value = saved.strat;
    $('#max').value = saved.max; $('#ascii').checked = saved.ascii;
    seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.d===saved.date));
  }
  $('#in').value = EXAMPLES[Math.floor(Math.random()*EXAMPLES.length)];
  moveThumb(seg.querySelector('.on') || seg.querySelector('button'), false);
  render();
});
