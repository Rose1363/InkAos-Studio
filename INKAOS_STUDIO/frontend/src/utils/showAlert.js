import Swal from "sweetalert2";

// or via CommonJS
export const showAlert = ({ title, icon }) => {
  Swal.fire({
    title: title, 
    icon: icon,   
    draggable: true,
    confirmButtonColor: '#91c4f6'
  });
};




export const confirmBox = (onConfirm) => {
  Swal.fire({
    title: "Bạn có chắc không?",
    text: "Bạn sẽ không thể hoàn tác hành động này!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Vâng, xóa nó!",
  }).then((result) => {
    if (result.isConfirmed) {
      if (onConfirm && typeof onConfirm === "function") {
        onConfirm();
      }
      Swal.fire({
        title: "Đã xóa!",
        text: "Sản phẩm của bạn đã bị xóa.",
        icon: "success",
      });
    }
  });
};