import Swal from "sweetalert2";

// or via CommonJS
const showAlert = ({ title, icon }) => {
  Swal.fire({
    title: title, 
    icon: icon,   
    draggable: true,
    confirmButtonColor: '#91c4f6'
  });
};

export default showAlert;
