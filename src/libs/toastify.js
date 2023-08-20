export default function toastify(message) {
   Toastify({
      text: message,
      duration: 1000,
      newWindow: true,
      close: false,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
         background: "#28A745",
      },
      onClick: function () {}, // Callback after click dfsfs
   }).showToast();
}
