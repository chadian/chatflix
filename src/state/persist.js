const LOCALSTORAGE_KEY = 'chatflix-state';

export function load() {
  try {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
  } catch (exception) {
    console.log('Whoops, we have an error LOADING chatflix state:');
    console.log(exception);
    return {};
  }
}

export function save(state) {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
  } catch (exception) {
    console.log('Whoops, we have an error SAVING chatflix state:');
    console.log(exception);
  }
}
