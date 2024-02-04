const { createApp, ref, onMounted, watch } = Vue;

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

import userProductModal from "./userProductModal.js";
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "jeremychan";

const App = {
  setup() {
    const isLoading = ref({ loadingItem: "" });
    const userProductModalRef = ref(null);
    const isDeleteCartsLoading = ref(false);
    const products = ref([]);
    const product = ref({});
    const cart = ref({});
    const formRef = ref(null);
    const form = ref({
      user: {
        name: "",
        email: "",
        tel: "",
        address: "",
      },
      message: "",
    });

    const getProducts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/${apiPath}/products/all`);
        console.log(res.data.products);
        products.value = res.data.products;
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    const getProductById = async (id) => {
      try {
        isLoading.value.loadingItem = id;
        const res = await axios.get(`${apiUrl}/api/${apiPath}/product/${id}`);
        console.log(res);
        isLoading.value.loadingItem = "";
        product.value = res.data.product;
        console.log("error");
        userProductModalRef.value.openModal();
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }
    };
    const addToCart = async (id, qty = 1) => {
      isLoading.value.loadingItem = id;
      const data = {
        product_id: id,
        qty,
      };
      try {
        const res = await axios.post(`${apiUrl}/api/${apiPath}/cart`, { data });
        console.log(res);
        alert(res.data.message);
        isLoading.value.loadingItem = "";
        getCart();
        userProductModalRef.value.hideModal();
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    const removeItemsFromCart = async () => {
      isDeleteCartsLoading.value = true;
      try {
        const res = await axios.delete(`${apiUrl}/api/${apiPath}/carts`);
        alert(res.data.message);
        getCart();
      } catch (error) {
        alert(error.response.data.message);
      }
      isDeleteCartsLoading.value = false;
    };
    const removeItemFromCartById = async (id) => {
      isLoading.value.loadingItem = id;
      try {
        const res = await axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`);
        alert(res.data.message);
        getCart();
      } catch (error) {
        alert(error.response.data.message);
      }
      isLoading.value.loadingItem = "";
    };
    const updateCart = async (item) => {
      isLoading.value.loadingItem = item.id;
      const data = {
        product_id: item.product_id,
        qty: item.qty,
      };
      try {
        const res = await axios.put(
          `${apiUrl}/api/${apiPath}/cart/${item.id}`,
          { data }
        );
        isLoading.value.loadingItem = "";
        getCart();
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    const getCart = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/${apiPath}/cart`);

        cart.value = res.data.data;
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    const createOrder = async () => {
      const data = form.value;
      try {
        const res = await axios.post(`${apiUrl}/api/${apiPath}/order`, {
          data,
        });
        alert(res.data.message);
        formRef.value.resetForm();
        getCart();
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    onMounted(() => {
      getProducts();
      getCart();
    });
    return {
      isLoading,
      product,
      cart,
      products,
      getProductById,
      addToCart,
      removeItemsFromCart,
      removeItemFromCartById,
      updateCart,
      isDeleteCartsLoading,
      userProductModalRef,
      formRef,
      form,
      createOrder,
    };
  },
};

const app = createApp(App);

app
  .component("user-product-modal", userProductModal)
  .component("v-form", VeeValidate.Form)
  .component("v-field", VeeValidate.Field) //input selector
  .component("error-message", VeeValidate.ErrorMessage) //error msg
  .mount("#app");
