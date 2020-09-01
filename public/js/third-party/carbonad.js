var _carbon_where;
var _carbonads = {
  init: function (where, force_serve) {
    _carbon_where = null;
    if (where) {
      _carbon_where = where;
    }

    var placement = 'nightwatchjsorg';
    var baseurl = 'srv.carbonads.net';
    var protocol = 'https:';
    var serve = this.getServe('C6AILKT', placement);
    var forceUrlPreview = this.getUrlVar('_bsa_url_preview', window.location.href);

    if (forceUrlPreview) {
      var previewData = JSON.parse(decodeURIComponent(forceUrlPreview));
      setTimeout(function () {
        _carbonads_go({
          ads: [Object.assign({}, previewData, {
            zonekey: serve,
            statlink: previewData.link
          }), {}]
        })
      }, 0)
    } else {
      var pro = document.createElement('script');
      pro.id = '_carbonads_projs';
      pro.type = 'text/javascript';
      pro.src = this._buildSrvUrl(protocol + '//' + baseurl + '/ads/' + serve + '.json?segment=placement:' + placement + '&callback=_carbonads_go');
      document.getElementsByTagName('head')[0].appendChild(pro)
    }
  },
  _buildSrvUrl: function (base) {
    var forcebanner = this.getUrlVar('bsaforcebanner', window.location.href),
      ignore = this.getUrlVar('bsaignore', window.location.href),
      forwardedip = this.getUrlVar('bsaforwardedip', window.location.href);
    ignoretargeting = this.getUrlVar('bsaignoretargeting', window.location.href);
    if (forcebanner) {
      base += '&forcebanner=' + forcebanner;
    }
    if (ignore) {
      base += '&ignore=' + ignore;
    }
    if (ignoretargeting) {
      base += '&ignoretargeting=' + ignore;
    }
    if (forwardedip) {
      base += '&forwardedip=' + forwardedip;
    }
    var ck = '';
    try {
      ck = decodeURIComponent(document.cookie)
    } catch (e) {
    }
    ;var day = ck.indexOf('_bsap_daycap='), life = ck.indexOf('_bsap_lifecap=');
    day = day >= 0 ? ck.substring(day + 12 + 1).split(';')[0].split(',') : [];
    life = life >= 0 ? ck.substring(life + 13 + 1).split(';')[0].split(',') : [];
    if (day.length || life.length) {
      var freqcap = [];
      for (var i = 0; i < day.length; i++) {
        var adspot = day[i];
        for (var found = -1, find = 0; find < freqcap.length && found == -1; find++) {
          if (freqcap[find][0] == adspot) {
            found = find;
          }
        }
        if (found == -1) {
          freqcap.push([adspot, 1, 0]);
        } else {
          freqcap[found][1]++
        }
      }
      for (var i = 0; i < life.length; i++) {
        var adspot = day[i];
        for (var found = -1, find = 0; find < freqcap.length && found == -1; find++) {
          if (freqcap[find][0] == adspot) {
            found = find;
          }
        }
        if (found == -1) {
          freqcap.push([adspot, 0, 1]);
        } else {
          freqcap[found][2]++
        }
      }
      for (var i = 0; i < freqcap.length; i++) {
        freqcap[i] = freqcap[i][0] + ':' + freqcap[i][1] + ',' + freqcap[i][2];
      }
      if (freqcap.length) {
        base += '&freqcap=' + encodeURIComponent(freqcap.join(';'))
      }
    }
    return base
  },
  getServe: function (serve, placement) {
    var r = new Array();
    r['nightwatchjsorg'] = 'CKYILK3M';

    if (this.isset(r[placement]) && (serve == 'CVYD42T' || serve == 'CVYD42E' || serve == 'C6AILKT')) {
      return r[placement];
    } else if (serve == 'CVYD42T' || serve == 'CVYD42E' || serve == 'C6AILKT') {
      return 'CKYICKQI';
    } else {
      return serve
    }
  },
  getUrlVar: function (name, target) {
    target = typeof target !== 'undefined' ? target : document.getElementById('_carbonads_js').src, name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(target);
    if (results == null) {
      return '';
    } else {
      return results[1]
    }
  },
  isset: function (v) {
    return typeof v !== 'undefined' && v != null
  },
  nonempty: function (v) {
    return this.isset(v) && v != ""
  },
  refresh: function () {
    _carbonads.gotback = false;
    this.remove(document.getElementById('_carbonads_projs'));
    this.remove(document.getElementById('carbonads'));
    this.init()
  },
  reload: function (where, force_serve) {
    _carbonads.gotback = false;
    this.remove(document.getElementById('_carbonads_projs'));
    this.init(where, force_serve)
  },
  remove: function (el) {
    if (typeof el !== 'undefined' && el != null) {
      el.parentNode.removeChild(el)
    }
  },
  htmlEncode: function (v) {
    return v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;')
  }
};

function _carbonads_go(b) {
  var ad = b['ads'][0], link, fulllink, image, description, time = Math.round(Date.now() / 10000) | 0;
  var placement = _carbonads.getUrlVar('placement');
  var serve = _carbonads.getUrlVar('serve');
  if (ad.html != null) {
    var ad_html = JSON.parse(ad.html);
    ad.image = ad_html.image, ad.statlink = ad_html.statlink, ad.description = ad_html.description, ad.pixel = ad_html.pixel;
    ad.fetch = ad_html.fetch;
    ad.click_redir = ad_html.click_redir
  }
  if (ad.fetch != null) {
    var fetch = document.createElement('script');
    fetch.type = 'text/javascript';
    fetch.id = '_carbonads_fetchjs';
    fetch.src = ad.fetch;
    if (ad.fetch.match('fallbacks.carbonads.com')) {
      fetch.src += '/' + placement + '/8/';
    }
    if (ad.click_redir != null) {
      fetch.src += '?click_redir=' + encodeURIComponent(ad.click_redir.replace(/srv.buysellads.com/g, 'srv.carbonads.net'));
    }
    document.getElementsByTagName('head')[0].appendChild(fetch);
    _carbonads.remove(document.getElementById('_carbonads_fetchjs'));
    return
  }
  if (!_carbonads.nonempty(ad.statlink) && (!(_carbonads.nonempty(ad.fallbackImage) && _carbonads.nonempty(ad.fallbackLink) && _carbonads.nonempty(ad.fallbackTitle)) || !(_carbonads.nonempty(ad.fallbackZoneKey))) && (!(_carbonads.nonempty(ad.fallbackImage) && _carbonads.nonempty(ad.fallbackLink) && _carbonads.nonempty(ad.fallbackTitle)))) {
    var fallbackKey = _carbonads.nonempty(ad.fallbackZoneKey) ? ad.fallbackZoneKey : 'CK7DT53I';
    if (_carbonads.gotback === fallbackKey) {
      return;
    }
    _carbonads.gotback = fallbackKey;
    var fallback = document.createElement('script');
    fallback.type = 'text/javascript';
    fallback.id = '_carbonads_fallbackjs';
    fallback.src = _carbonads._buildSrvUrl('https://srv.carbonads.net/ads/' + fallbackKey + '.json?segment=placement:' + placement + '&callback=_carbonads_go');
    if (ad.fallbackTitle !== 'hide') {
      document.getElementsByTagName('head')[0].appendChild(fallback);
      _carbonads.remove(document.getElementById('_carbonads_fallbackjs'))
    }
    return
  }
  image = _carbonads.isset(ad.logo) ? ad.logo : _carbonads.isset(ad.smallImage) ? ad.smallImage : _carbonads.isset(ad.image) ? ad.image : ad.fallbackImage;
  link = _carbonads.isset(ad.statlink) ? ad.statlink.split('?encredirect=') : ad.fallbackLink.replace(/^(http:|https:)/gm, '');
  description = _carbonads.isset(ad.description) ? ad.description : _carbonads.isset(ad.title) ? ad.title : ad.fallbackTitle;
  bgcolor = _carbonads.isset(ad.backgroundHoverColor) ? ad.backgroundHoverColor : null;
  if (typeof link[1] != 'undefined' && _carbonads.isset(ad.statlink)) {
    fulllink = link[0] + '?segment=placement:' + placement + ';&encredirect=' + encodeURIComponent(link[1]);
  } else if (link[0].search('srv.buysellads.com') > 0 && _carbonads.isset(ad.statlink)) {
    fulllink = link[0] + '?segment=placement:' + placement + ';';
  } else if (Array.isArray(link)) {
    fulllink = link[0];
  } else {
    fulllink = link;
  }
  fulllink = fulllink.replace(/srv.buysellads.com/g, 'srv.carbonads.net');
  var el = document.createElement('span');
  el.innerHTML = '<span class="carbon-wrap"><a href="https:' + fulllink.replace('[timestamp]', time) + '" class="carbon-img" target="_blank" rel="noopener sponsored"><img src="' + image + '" alt="ads via Carbon" border="0" ' + (_carbonads.isset(bgcolor) ? 'style="background:' + bgcolor + ';width:100px;padding: 30px 15px;box-sizing: content-box;"' : '') + ' /></a><a href="https:' + fulllink.replace('[timestamp]', time) + '" class="carbon-text" target="_blank" rel="noopener sponsored">' + _carbonads.htmlEncode(description) + '</a></span>';
  if (!_carbonads.isset(ad.removecarbon)) {
    el.innerHTML += '<a href="http://carbonads.net/?utm_source=' + placement + '&utm_medium=ad_via_link&utm_campaign=in_unit&utm_term=carbon" class="carbon-poweredby" target="_blank" rel="noopener sponsored">ads via Carbon</a>';
  }
  if (typeof ad.pixel != 'undefined') {
    var pixels = ad.pixel.split('||');
    for (var j = 0; j < pixels.length; j++) {
      var pix = document.createElement('img');
      pix.src = pixels[j].replace('[timestamp]', time);
      pix.border = '0';
      pix.height = '1';
      pix.width = '1';
      pix.style.display = 'none';
      pix.alt = 'ads via Carbon';
      el.appendChild(pix)
    }
  }
  var n = document.getElementsByClassName('carbon-wrap');
  var fdiv = document.createElement('div');
  fdiv.id = n.length > 0 ? 'carbonads_' + n.length : 'carbonads';
  fdiv.appendChild(el);
  var carbonjs = document.getElementById('_carbonads_js');
  if (carbonjs != null) {
    if (_carbonads.isset(_carbon_where)) {
      _carbon_where.appendChild(fdiv);
    } else {
      carbonjs.parentNode.insertBefore(fdiv, carbonjs.nextSibling);
    }
  }
  var mw = document.querySelectorAll('.carbon-img > img');
  for (var i = 0; i < mw.length; i++) {
    mw[i].style.maxWidth = '130px';
  }
  _bsap_serving_callback(ad.bannerid, ad.zonekey, ad.freqcap);
  if (_carbonads.nonempty(ad.fallbackTitle) && !_carbonads.nonempty(ad.statlink)) {
    if (ad.fallbackTitle === 'hide') {
      _carbonads.remove(document.getElementById('carbonads'))
    }
  }
}

window['_bsap_serving_callback'] = function (banner, zone, freqcap) {
  var append = function (w, data, days) {
    var c = document.cookie, i = c.indexOf(w + '='),
      existing = i >= 0 ? c.substring(i + w.length + 1).split(';')[0] + '%2C' : '', d = new Date();
    d.setTime(days * 3600000 + d);
    data = existing + data;
    data = data.substring(0, 2048);
    document.cookie = w + '=' + data + '; expires=' + d.toGMTString() + '; SameSite=Lax; path=\/'
  };
  if (freqcap) {
    append('_bsap_daycap', banner, 1);
    append('_bsap_lifecap', banner, 365)
  }
};

