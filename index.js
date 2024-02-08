document.addEventListener("DOMContentLoaded", function () {
    // Carga la lista de contactos al iniciar la página
    loadContactList();
  });
  
// Funcion base mensaje alert 
function messageAlert(message) {
    alert(message);
}

// Función base para realizar la acción de agregar un nuevo contacto
function performAddAction() {
    // Obtiene los valores del formulario
    const name = document.getElementById("name").value.trim(); //Toma el valor y para eliminar los espacios en blanco  de todos los input 
    const email = document.getElementById("email").value.trim();
    const birthdate = document.getElementById("birth").value.trim();
  

 // Validar campos obligatorios
 function validateFields(name, email, birthdate) { //Llamo a los paramentros 
    if (name === "" || email === "" || birthdate === "") { // Verifica si los campos están vacío.
      messageAlert("Por favor, completa todos los campos."); //Alert
      return false; // Si la condición de que al menos uno de los campos está vacío se cumple, la función devuelve false si fallo
  }
      return true;
    }

    // Campos obligatorios
    if (!validateFields(name, email, birthdate)) { //Llamo a la funcion con su argumentos
      return; // Se encargan de detener la ejecución de la función actual, si la validación de campos (`validateFields`) falla
    }

    // Verificar si existe el nombre y email proporcionado
    if (isContactExists(name, email)) { // Si ya existe un contacto con este nombre o correo electrónico
      console.log("El contacto ya existe", name, email);
      messageAlert("Ya existe un contacto con este nombre o correo electrónico.");
      clearForm(); // Limpiar el formulario
      return;
    }
  
  
    // Genera un ID único para el nuevo contacto, para poder agregarlos a la lista
    const id = generateContactId(); 
    const contact = { id, name, email, birthdate }; //Creo objeto contact para agregarlo a la lista 
  
    addContact(contact); // Agrega el nuevo contact
    clearForm(); //Despues de que se agrega este contacto limpiar el formulario

}

// Función base que se encarga de obtener los valores del formulario, validar que todos los campos estén completos, crear un objeto de contacto actualizado y luego llamar a la función `updateContact()` para actualizar el contacto en la lista.
function performUpdateAction() {
    // Obtiene los valores del formulario
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthdate = document.getElementById("birth").value.trim();
    const id = document.getElementById("contactForm").getAttribute("data-id");

      // Validación de campos vacios
      if (name === "" || email === "" || birthdate === "") {
      messageAlert("Por favor, completa todos los campos.");
      return; // Se retorna, evitando que el código continúe ejecutándose.

    }
    
    // Si todos los elementos estan completos se crea el obj contact actualizado
    // Crea un objeto de contacto actualizado
    const contact = { id, name, email, birthdate };

    // Actualiza el contacto y la interfaz
    updateContact(contact); 
    clearForm();
    document.getElementById("addButton").disabled = false;
    document.getElementById("updateButton").disabled = true;
}

// Funcion base que se encarga específicamente de actualizar un contacto en la lista de contactos.
function updateContact(updatedContact) {
  const contacts = getContacts();
  const index = contacts.findIndex((contact) => contact.id == updatedContact.id);

  if (index !== -1) {
    contacts[index] = updatedContact;
    saveContacts(contacts);

    // Limpia el formulario y habilita el botón de agregar después de actualizar
    clearForm();
    document.getElementById("addButton").disabled = false;
    document.getElementById("updateButton").disabled = true;

    // Muestra el mensaje y vuelve a cargar la lista después de la actualización
    messageAlert("Contacto actualizado exitosamente.");
    loadContactList();
    console.log(updateContact())
  }
}

  
// Funcion base que verifica si ya existe un contacto con el mismo nombre o correo electrónico
function isContactExists(name, email) {
    const contacts = getContacts(); // Obtiene la lista de contactos desde el almacenamiento local

    return contacts.some((contact) => contact.name === name || contact.email === email); // La condición es que el nombre o el correo electrónico del contacto sea igual a los parámetros proporcionados
}

// Funcion base que verifica si ya existe un contacto con el mismo nombre o correo electrónico para actualización
function isContactExistsForUpdate(id, name, email) {
  const contacts = getContacts(); // Obtiene la lista de contactos desde el almacenamiento local
  return contacts.some( // La condición es que el ID del contacto no sea igual al ID proporcionado y que el nombre o el correo electrónico coincidan
    (contact) => contact.id !== id && (contact.name === name || contact.email === email)
  );
}
  
// Funcion base que genera un ID único para un nuevo contacto
function generateContactId() {
    const contacts = getContacts();
    return contacts.length + 1; // Devolviendo un ID que es 1 más grande que la cantidad actual de contactos en la lista
}
  
// Funcion base que agrega un nuevo contacto a la lista
function addContact(contact) {
    const contacts = getContacts();
    contacts.push(contact); // Agrega un nuevo contacto al final de la lista
    saveContacts(contacts); // Guarga la lista actualizada de contactos en el almacenamiento local, convierte a JSON
    messageAlert("Contacto agregado exitosamente.");
    loadContactList(); // Vuelve a cargar la lista
}
  
  // Función base que solicita confirmación antes de eliminar un contacto
  function deleteContact(id) {
    const confirmation = confirm("¿Estás seguro de que quieres eliminar este contacto?"); //Cuadro de confirmacion
      if (!confirmation) { //Verifica si el usuario ha confirmado la eliminación. Si el usuario hace clic en "Cancelar" (confirmación es `false`), la función sale inmediatamente utilizando `return
      return;
    }
  
    // Elimina el contacto y actualiza la interfaz
    const contacts = getContacts();
    const filteredContacts = contacts.filter((contact) => contact.id != id); // Se crean los nuevos contactos y se excluye el contacto que se va a eliminar
    saveContacts(filteredContacts); // Guarda la nueva lista de contactos 
    messageAlert("Contacto eliminado exitosamente.");
    loadContactList(); // Vuelve a cargar la lista 
  }
  
  // Función base que carga los datos de contacto en la tabla 
  function loadContactList() {
    const contacts = getContacts();
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = ""; //Limpiar el contenido existente 
  
    // Creamos la tabla
    const table = document.createElement("table");
  
    // Creamos el encabezado de la tabla
    const board = document.createElement("board");
    const row = document.createElement("tr");
    row.innerHTML = `
        <th>Nombre</th>
        <th>Email</th>
        <th>Fecha de Nacimiento</th>
        <th>Acciones</th>
    `;
    board.appendChild(row);
    table.appendChild(board);
  
    // Iterate sobre la lista de contactos y crea filas de tabla con datos de nombre, email, fecha de nacimiento y botones para editar y eliminar
    for (const contact of contacts) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${contact.name}</td>
          <td>${contact.email}</td>
          <td>${formatDate(contact.birthdate)}</td>
          <td>
            <button onclick="editContact(${contact.id})">Editar</button>
            <button onclick="deleteContact(${contact.id})">Eliminar</button>
          </td>
      `;
      table.appendChild(tr); //Adjunta cada fila de la tabla a la tabla
    }
  
    // Adjuntar la tabla a contactList debajo del html
    contactList.appendChild(table);
  }
  
  // Funcion base para cargar los datos del contacto en el formulario para su edición
  function editContact(id) {
    const contacts = getContacts();
    const contact = contacts.find((contact) => contact.id == id); //Utiliza el método `find()` para buscar el contacto con el ID proporcionado en la lista con la variable contact
  
    // Si se encuentra el contacto, llena el formulario con sus datos y habilita el botón de actualización
    if (contact) {
      document.getElementById("name").value = contact.name;
      document.getElementById("email").value = contact.email;
      document.getElementById("birth").value = contact.birthdate;
  
      document.getElementById("addButton").disabled = true;
      document.getElementById("updateButton").disabled = false;
  
      // Establece atributos en el formulario para su identificación durante la actualización
      document
        .getElementById("contactForm")
        .setAttribute("data-action", "update");
      document.getElementById("contactForm").setAttribute("data-id", id);
    }
  }
  
  // Limpia el formulario y los atributos asociados
  function clearForm() {
    document.getElementById("contactForm").reset(); //Restablecer todos los campos del formulario
    document.getElementById("contactForm").removeAttribute("data-action"); //Elimina el atributo data-action del formulario con removeAttribute()
    document.getElementById("contactForm").removeAttribute("data-id");
  }
  
  // Obtiene la lista de contactos desde el almacenamiento local
  function getContacts() {
    return JSON.parse(localStorage.getItem("contacts")) || []; // Utilizo el operador de fusión nula (`||`) para proporcionar un valor predeterminado en caso de que el resultado de `JSON.parse()` sea `null` o `undefined`
  }
  
  // Funcion base para guardar la lista de contactos en el almacenamiento local
  function saveContacts(contacts) {
    if (contacts.length === 0) { //Verifico si la lista esta vacio igualando a cero
      localStorage.removeItem("contacts"); // Si la lista está vacía, significa que no hay contactos para almacenar.
    } else {
      localStorage.setItem("contacts", JSON.stringify(contacts)); //Si la lista no esta vacia , lo convierte en una cadena JSON y luego lo almacenamos en contacts en el almacenamiento local
    }
  }
  

  // Función base para formatear la fecha al formato día, mes, año
  function formatDate(dateString) {
    // Parseamos la fecha en el formato esperado por el navegador
    const dateParts = dateString.split("-"); // Divide la cadena en partes utilizando "-"
    // Asigna las partes obtenidas a las variables
    const year = dateParts[0]; 
    const month = dateParts[1];
    const day = dateParts[2];
  
    // Construimos la fecha en la zona horaria local del usuario
    const date = new Date(year, month - 1, day); // //Crea un objeto date, se le resta 1 porque en Javascript arranca de 0
  
    // Obtenemos los componentes de la fecha en el formato deseado
    const formattedDay = ("0" + date.getDate()).slice(-2); // Obtener el día con dos caracteres
    const formattedMonth = ("0" + (date.getMonth() + 1)).slice(-2); // Obtener el mes con dos dígitos
    const formattedYear = date.getFullYear();
  
    // Construimos y retornamos la fecha formateada
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  }