var tabSelect, historySelect, bookmarkSelect, select;
tabSelect = function(){
  var dfd;
  dfd = $.Deferred();
  chrome.tabs.query({
    currentWindow: true
  }, function(tabs){
    var e;
    return dfd.resolve((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = tabs).length; i$ < len$; ++i$) {
        e = ref$[i$];
        results$.push({
          getId: e.id,
          getTitle: e.title,
          getUrl: e.url,
          getType: 'tab'
//           id: e.id,
//           title: e.title,
//           url: e.url,
//           type: 'tab'
        });
      }
      return results$;
    }()));
  });
  return dfd.promise();
};
historySelect = function(){
  var dfd;
  dfd = $.Deferred();
  chrome.history.search({
    text: '',
    maxResults: 1000
  }, function(hs){
    var e;
    return dfd.resolve((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = hs).length; i$ < len$; ++i$) {
        e = ref$[i$];
        results$.push({
          getId: e.id,
          getTitle: e.title,
          getUrl: e.url,
          getType: 'history'
//           id: e.id,
//           title: e.title,
//           url: e.url,
//           type: 'history'
        });
      }
      return results$;
    }()));
  });
  return dfd.promise();
};
bookmarkSelect = function(){
  var dfd;
  dfd = $.Deferred();
  chrome.bookmarks.search("h", function(es){
    var e;
    return dfd.resolve((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = es).length; i$ < len$; ++i$) {
        e = ref$[i$];
        if (e.url != null) {
          results$.push({
            getId: e.id,
            getTitle: e.title,
            getUrl: e.url,
            getType: 'bookmark'
//             id: e.id,
//             title: e.title,
//             url: e.url,
//             type: 'bookmark'
          });
        }
      }
      return results$;
    }()));
  });
  return dfd.promise();
};
select = function(func){
  return $.when(tabSelect(), historySelect(), bookmarkSelect()).done(function(ts, hs, bs){
    return func(ts.concat(hs, bs));
  });
};
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse){
  console.log(msg);
  if (msg.mes === "makeSelectorConsole") {
    select(sendResponse);
  } else if (msg.mes === "decideSelector") {
    console.log(msg);
    switch (msg.item.type) {
    case "tab":
      console.log('tabs.update');
      chrome.tabs.update(parseInt(msg.item.id), {
        active: true
      });
      break;
    case "websearch":
      console.log('web search');
      chrome.tabs.create({
        url: msg.item.url + msg.item.query
      });
      break;
    default:
      chrome.tabs.create({
        url: msg.item.url
      });
    }
    select(sendResponse);
  }
  return true;
});