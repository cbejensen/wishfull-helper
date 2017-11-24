// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCcpmz6SLB1nWt3j4x7HwVFoiohdXSRRo4',
  authDomain: 'wishfull.firebaseapp.com',
  databaseURL: 'https://wishfull.firebaseio.com',
  projectId: 'project-4729593249156139744',
  storageBucket: 'project-4729593249156139744.appspot.com',
  messagingSenderId: '803295527658'
};
firebase.initializeApp(config);

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, tabs => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const loading = document.querySelector('.loading');
  const signInForm = document.querySelector('.sign-in-form');
  signInForm.addEventListener('submit', signIn)
  const wishForm = document.querySelector('.wish-form');
  const title = document.querySelector('#wish-title');
  const description = document.querySelector('#wish-desc');
  const rank = document.querySelector('#wish-rank');
  const rankValue = document.querySelector('.wish-rank-value');
  rankValue.innerHTML = rank.value;
  
  showSection('loading');
  firebase.auth().onAuthStateChanged(user => {
    console.log(user);
    if (user) {
      showSection('wish-form');
    } else {
      showSection('sign-in-form');
    }
  });

  function showSection(str) {
    if (str === 'loading') {
      container.classList.add('show-loading');
      container.classList.remove('show-sign-in-form');
      container.classList.remove('show-wish-form');
    } else if (str === 'sign-in-form') {
      container.classList.remove('show-loading');
      container.classList.add('show-sign-in-form');
      container.classList.remove('show-wish-form');
    } else if (str === 'wish-form') {
      container.classList.remove('show-loading');
      container.classList.remove('show-sign-in-form');
      container.classList.add('show-wish-form');
    } else {
      container.classList.add('show-loading');
      container.classList.remove('show-sign-in-form');
      container.classList.remove('show-wish-form');
      loading.textContent = 'There was an error. Please try again later.'
    }
  }

  function signIn(e) {
    e.preventDefault();
    const email = this[0].value;
    const pwd = this[1].value;
    firebase.auth().signInWithEmailAndPassword(email, pwd).catch(err => {
      console.error(err.message);
    });
  }

  rank.onchange = e => {
    console.log(e.target.value);
    rankValue.innerHTML = e.target.value;
  };
  getCurrentTabUrl(url => {});
});
