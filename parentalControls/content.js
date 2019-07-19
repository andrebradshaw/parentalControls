/* UNDER DEVELOPMENT
  a simple chrome extension to monitor web traffic and allow an admin to control or report on what a user views.

  Search By => 
    type: 
      boolean strings (not as switch)

    content: 
      URL, 
      text body,
      read through transcripts on youtube => 

   Blacklisting By =>
    static url,
    url search,
    content search,
    

  TODO: 
    create manifest.json with permissions for local storage, 

  //Interesting ideas: monitoring overrustle logs => allowing automatic blacklistings of streamers with matching chat
*/

var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);

function parseAsRegexArr(bool) {
    function rxReady(s){ return s ? s.replace(/"/g, '\\b').trim().replace(/\)/g, '').replace(/\(/g, '').replace(/\s+/g, '.{0,2}').replace(/\//g, '\\/').replace(/\+/g, '\\+').replace(/\s*\*\s*/g, '\\s*\\w*\\s+') : s;}
    function checkSimpleOR(s) { return /\bor\b/i.test(s) && /\(/.test(s) === false;}
    if (checkSimpleOR(bool)) {
      var x = new RegExp(bool.replace(/\s+OR\s+|\s*\|\s*/gi, '|').replace(/\//g, '\\/').replace(/"/g, '\\b').replace(/\s+/g, '.{0,2}').replace(/\s*\*\s*/g, '\\s*\\w*\\s+'), 'i');
      var xArr = [x];
      return xArr;
    } else {
      var orx = "\\(.+?\\)|(\\(\\w+\\s{0,1}OR\\s|\\w+\\s{0,1}OR\\s)+((\\w+\s)+?|(\\w+)\\)+)+?";
      var orMatch = bool ? bool.match(new RegExp(orx, 'g')) : [];
      var orArr = orMatch ? orMatch.map(function(b) {return rxReady(b.replace(/\s+OR\s+|\s*\|\s*/gi, '|'))}) : [];
      var noOrs = bool ? bool.replace(new RegExp(orx, 'g'), '').split(/\s+[AND\s+]+/i) : bool;
      var ands = noOrs ? noOrs.map(function(a) { return rxReady(a)}) : [];
      var xArr = ands.concat(orArr).filter(function(i){ return i != ''}).map(function(x){return new RegExp(x, 'i')});
      return xArr;
    }
}
function search(bool,target){
  var arr = typeof bool === "object" ? bool : parseAsRegexArr(bool);
  return arr.every(function(x){
    return x.test(target);
  });
}

var checkUrl = (bool) => search(bool,window.location.href);

if(checkUrl('wikipedia') && search('deflationary theory',document.body.innerText)) {
  document.body.innerHTML = ''; 
  var c = ele('div');
  attr(c,'style','position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; background: #1c1c1c;');
  document.body.appendChild(c);
}
