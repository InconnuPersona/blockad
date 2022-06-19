(function () {
  var timerId,
	  adsClassList = [
		"ytp-ad-text ytp-ad-skip-button-text",// Video Ad; "Skip Ad" or "Skip Ads" button
		"videoAdUiSkipButton", // Video Ad
		"ytp-ad-skip-button ytp-button", // Video Ad; "Skip Ad" or "Skip Ads" button
		"ytp-ad-overlay-close-button", // Banner Ad; "X" button
	  ];
  var isInIframe = (function() {
    try {
      return (window.self !== window.top);
    } catch (e) {
      return true;
    }
  })();

  if (!isInIframe)
    initTimeout();

  function simulateClick(el) {
    var eventType = 'click';

	if (el.fireEvent) {
		el.fireEvent('on' + eventType);
	} else {
		var evObj = document.createEvent('Events');
		evObj.initEvent(eventType, true, false);
		el.dispatchEvent(evObj);
	}
  }

  function initTimeout() {
    clearTimeout(timerId);

    if (initDomTreeObserver()) {
      return;
    }
    timerId = setTimeout(function() {
      checkAndClickButtons();

      initTimeout();
    }, 2000);
  }

  function existingButtons(classNames) {
    return classNames.map(name => {
        return Array.from(document.getElementsByClassName(name)) || [];
      }).reduce(function(acc, elems) {
        return acc.concat(elems);
      }, []);
  }

  function isElementVisible(ele) {
    return ele.offsetParent === null ? false : true;
  }

  function simulateClickOnVisible(button) {
	var skipButton = null, skipButtonDomTreeObserver;
    var hiddenElement = (function() {
      var currentElement = button;
      while (currentElement !== null) {
        if (currentElement.style.display === 'none')
          return currentElement;

        currentElement = currentElement.parentElement;
      }

      return null;
    })();

    if (!hiddenElement || button === skipButton)
      return;

    if (skipButtonDomTreeObserver && skipButton) {
      skipButtonDomTreeObserver.disconnect();
      simulateClick(skipButton);
    }

    if (!skipButtonDomTreeObserver) {
      skipButtonDomTreeObserver = new MutationObserver(function() {
        if (!isElementVisible(skipButton)) {
          return;
        }

        simulateClick(skipButton);
        skipButton = undefined;
        skipButtonDomTreeObserver.disconnect();
      });
    }

    skipButton = button;
    skipButtonDomTreeObserver.observe(hiddenElement, { attributes: true });
  }

  function checkAndClickButtons() {
    existingButtons(adsClassList).forEach(button => {
      if (!isElementVisible(button)) {
        simulateClickOnVisible(button);
        return;
      }

      simulateClick(button);
    })
  }

  function initDomTreeObserver() {
    if (!('MutationObserver' in window)) {
      return false;
    }

    var ytPlayer = (function(nodeList) {
      return nodeList && nodeList[0];
    })(document.getElementsByTagName('ytd-player'));

    if (!ytPlayer) {
      return false;
    }

    var domTreeObserver = new MutationObserver(function() {
      checkAndClickButtons();
    });

    domTreeObserver.observe(ytPlayer, { childList: true, subtree: true });

    clearTimeout(timerId);

    return true;
  }

})();

let ogVolume=1;
let pbRate = 1;

setInterval(function(){
    if(document.getElementsByClassName("video-stream html5-main-video")[0]!==undefined){
        let ad = document.getElementsByClassName("video-ads ytp-ad-module")[0];
        let vid = document.getElementsByClassName("video-stream html5-main-video")[0];
        if(ad==undefined){
            pbRate = vid.playbackRate;
        }
        let closeAble = document.getElementsByClassName("ytp-ad-overlay-close-button");
        for(let i=0;i<closeAble.length;i++){
            closeAble[i].click();
            //console.log("ad banner closed!")
        }
        if(document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0]!==undefined){
            let sideAd=document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0];
            sideAd.style.display="none";
            //console.log("side ad removed!")
        }
        if(document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0]!==undefined){
            let sideAd_ = document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0];
            sideAd_.style.display="none";
            //console.log("side ad removed!")
        }
        if(document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0]!==undefined){
            let skipBtn=document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0];
            skipBtn.click();
            //console.log("skippable ad skipped!")
        }
        if(document.getElementsByClassName("ytp-ad-message-container")[0]!==undefined){
            let incomingAd=document.getElementsByClassName("ytp-ad-message-container")[0];
            incomingAd.style.display="none";
            //console.log("removed incoming ad alert!")
        }
        if(document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0]!==undefined){
            document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0].remove();
            //console.log("side ad removed!")
        }
        if(ad!==undefined){
            if(ad.children.length>0){
                if(document.getElementsByClassName("ytp-ad-text ytp-ad-preview-text")[0]!==undefined){
                    vid.playbackRate=16;
                    //console.log("Incrementally skipped unskippable ad!")
                }
            }
        }
    }
},100)
