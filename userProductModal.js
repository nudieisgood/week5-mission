const { createApp, ref, onMounted, watch, toRefs } = Vue;

export default {
  template: "#userProductModal",
  props: ["product"],
  setup(props) {
    const modalRef = ref(null);
    const modal = ref(null);
    const qty = ref(1);
    const { product } = toRefs(props);

    const openModal = () => {
      modal.value.show();
    };

    const hideModal = () => {
      modal.value.hide();
    };

    onMounted(() => {
      modal.value = new bootstrap.Modal(modalRef.value, {
        keyboard: false,
        backdrop: "static",
      });
    });

    watch(product, () => (qty.value = 1));

    return {
      modalRef,
      qty,
      hideModal,
      openModal,
    };
  },
};
