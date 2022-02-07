const reader = new FileReader();
reader.onload = event => parseFile(event);
reader.onerror = error => reject(error);

let data = {};



let file = document.getElementById('file');
let delete_btn = document.getElementById('delete');
let exceptions = document.getElementById('exceptions');
let apply_btn = document.getElementById('apply');
let table = document.getElementById('table');

file.addEventListener('change', getFile);
delete_btn.addEventListener('click', deleteFile);
apply_btn.addEventListener('click', rebuildTable);
table.addEventListener('click', handleTableClick);


function getFile() {
  let uploaded_file = file.files[0];
  reader.readAsText(uploaded_file);
}

function parseFile(event) {
  let result = event.target.result;
  try{
    data = JSON.parse(result);
  }
  catch(err){
    alert("Can't parse JSON data.");
    return;
  }

  checkDuplicates();
}

function checkDuplicates() {
  let obj = remove_exceptions();
  let line_index = 1;
  let matched_keys = [];

  for (let key in obj) {
    for (let key2 in obj) {
      if (key !== key2 && obj[key] === obj[key2] && !matched_keys.includes(key)) {
        matched_keys.push(key2);
        let tr = document.createElement('tr');
        let line = document.createElement('td');
        let key_1 = document.createElement('td');
        let key_2 = document.createElement('td');
        let message = document.createElement('td');
        let actions = document.createElement('td');
        let delete_row_btn = document.createElement('input');

        line.innerHTML = line_index++;
        key_1.innerHTML = key;
        key_2.innerHTML = key2;
        message.innerHTML = obj[key];
        delete_row_btn.value = 'Delete';
        delete_row_btn.type = 'button';
        delete_row_btn.classList.add('delete_row_button');


        actions.appendChild(delete_row_btn);
        tr.appendChild(line);
        tr.appendChild(key_1);
        tr.appendChild(key_2);
        tr.appendChild(message);
        tr.appendChild(actions);

        table.appendChild(tr);
      }
    }
  }
}

function remove_exceptions(){  
  if (exceptions.value) {
    let obj = {...data}
    let exceptions_keys = exceptions.value.replaceAll(' ', '');
    exceptions_keys = [...exceptions_keys];

    for (let key in obj) {
      for (let exc of exceptions_keys) {
        obj[key] = obj[key].replaceAll(exc, '');
      }
    }
    return obj;
  }
  //do nothink
  else{
    return data;
  }
}

function handleTableClick(e) {
  if (e.target.classList.contains('delete_row_button')) {
    let row = e.target.parentNode.parentNode;
    row.remove();
  }
}

function rebuildTable(){
  table.innerHTML = `
      <tr>
        <th>Line</th>
        <th>Key 1</th>
        <th>Key 2</th>
        <th>Value</th>
        <th>Actions</th>
      </tr>`;

  checkDuplicates();
}

function deleteFile() {
  file.value = null;
  table.innerHTML = `
      <tr>
        <th>Line</th>
        <th>Key 1</th>
        <th>Key 2</th>
        <th>Value</th>
        <th>Actions</th>
      </tr>`
}