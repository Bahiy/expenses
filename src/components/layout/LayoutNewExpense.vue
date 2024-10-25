<template>
  <div class="w-100 d-flex justify-content-center">
    <button
      @click="showModal = true"
      class="btn btn-lg btn-outline-primary w-75"
    >
      <i class="fa fa-plus"></i> Novo Gasto
    </button>

    <form @submit.prevent="submit()">
      <div
        class="modal fade"
        :class="{ show: showModal }"
        :style="{ display: showModal ? 'block' : 'none' }"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLiveLabel">
                Adicionar Gasto
              </h1>
              <button
                @click="closeModal()"
                type="button"
                class="btn-close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form-group col-8">
                  <label for="">Descrição</label>
                  <input
                    type="text"
                    class="form-control"
                    required
                    v-model="form.description"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="">Valor (R$)</label>
                  <input
                    type="text"
                    class="form-control"
                    required
                    v-model="form.value"
                  />
                </div>
                <div
                  class="form-group mt-4 col-12 d-flex flex-column align-items-center"
                >
                  <input
                    ref="input"
                    type="file"
                    class="d-none"
                    accept="image/*"
                    @change="handleChangeFile($event)"
                  />
                  <button
                    @click="openFileDialog()"
                    type="button"
                    class="btn w-50 btn-outline-secondary"
                  >
                    Adicionar comprovante
                  </button>

                  <div class="mt-3" v-if="form.receipt">
                    {{ form.receipt.name }}
                    <button
                      type="button"
                      class="btn badge-light"
                      @click="deleteReceipt()"
                    >
                      <i v-if="form.receipt" class="fa fa-trash text-danger" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                @click="closeModal(), resetForm()"
                type="button"
                class="btn btn-secondary"
              >
                Fechar
              </button>
              <button class="btn btn-primary">Incluir novo gasto</button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div
      class="modal-backdrop fade"
      :class="{ show: showModal }"
      :style="{ display: showModal ? 'block' : 'none' }"
    ></div>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false,
    form: {
      receipt: null,
      description: "",
      value: "",
    },
  }),
  computed: {
    fileName() {
      const { receipt } = this.form;

      if (receipt) {
        const split = receipt.name.split(".");
        return `${split[0]}-${new Date().getTime()}.${split[1]}`;
      } else {
        return "";
      }
    },
  },
  methods: {
    deleteReceipt() {
      this.form.receipt = "";
    },
    handleChangeFile(event) {
      this.form.receipt = event.target.files[0];
    },
    openFileDialog() {
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    async submit() {
      try {
        let url = "";
        this.$root.$emit("Spinner::show");
        const ref = this.$database.ref(window.uid);
        const id = ref.push().key;

        if (this.form.receipt) {
          const snapshot = await this.$storage
            .ref(window.uid)
            .child(this.fileName)
            .put(this.form.receipt);

          url = await snapshot.ref.getDownloadURL();
        }

        const payload = {
          id,
          createdAt: new Date().getTime(),
          ...this.form,
          receipt: url,
        };

        ref.child(id).set(payload, (err) => {
          console.log(payload);

          if (err) {
            console.error(err);
          } else {
            this.closeModal();
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.$root.$emit("Spinner::hide");
        this.resetForm();
      }
    },
    closeModal() {
      this.showModal = false;
    },
    resetForm() {
      for (let value in this.form) {
        this.form[value] = null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.modal {
  color: var(--darker);
}
</style>
