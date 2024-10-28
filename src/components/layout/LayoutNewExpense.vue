<template>
  <div class="w-100 d-flex justify-content-center">
    <button
      @click="showModal = true"
      class="btn btn-lg btn-outline-primary w-75"
    >
      <i class="fa fa-plus"></i> Novo Gasto
    </button>

    <form class="modal-form" @submit.prevent="submit()">
      <div
        class="modal fade"
        :class="{ show: showModal }"
        :style="{ display: showModal ? 'block' : 'none' }"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-4">Adicionar Gasto</h1>
              <button
                @click="closeModal()"
                type="button"
                class="btn-close"
              ></button>
            </div>
            <div class="modal-body mb-3 mt-3 mx-2">
              <div class="row">
                <div class="form-group col-8">
                  <label for="description">Descrição</label>
                  <input
                    id="description"
                    placeholder="Insira a descrição"
                    type="text"
                    class="form-control"
                    required
                    v-model="form.description"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="money">Valor (R$)</label>
                  <money
                    id="money"
                    type="text"
                    class="form-control"
                    required
                    v-model="form.value"
                  ></money>
                  <!-- <input
                    type="text"
                    class="form-control"
                    required
                    v-model="form.value"
                  /> -->
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

                  <div class="mt-3" v-if="form.receipt !== '/expenses-list'">
                    {{ form.receipt.name }}
                    <button
                      type="button"
                      class="btn badge-light"
                      @click="deleteReceipt()"
                    >
                      <i class="fa fa-trash text-danger" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                @click="closeModal()"
                type="button"
                class="btn btn-secondary"
              >
                Fechar
              </button>
              <template v-if="loading">
                <button class="btn btn-primary">
                  Adicionando...
                  <i class="fa fa-spinner fa-spin"></i>
                </button>
              </template>
              <button v-else class="btn btn-primary">Incluir novo gasto</button>
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
    loading: false,
    form: {
      receipt: "/expenses-list",
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
      this.form.receipt = "/expenses-list";
    },
    handleChangeFile(event) {
      this.form.receipt = event.target.files[0];
    },
    openFileDialog() {
      this.$refs.input.value = "";
      this.$refs.input.click();
    },
    async submit() {
      this.loading = true;
      try {
        let url = "";
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
            this.$root.$emit("Notification::show", {
              type: "danger",
              message: "Não foi possível inserir o gasto, tente novamente.",
            });
            console.log(err);
          } else {
            this.$root.$emit("Notification::show", {
              type: "success",
              message: "Gasto inserido com Sucesso!",
            });
            this.closeModal();
          }
        });
      } catch (error) {
        this.$root.$emit("Notification::show", {
          type: "danger",
          message: "Não foi possível inserir o gasto, tente novamente.",
        });
        console.error(error);
      } finally {
        this.resetForm();
        this.loading = false;
      }
    },
    resetForm() {
      this.form.receipt = "/expenses-list";
      this.form.description = "";
      this.form.value = "";
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
  },
};
</script>

<style scoped lang="scss">
.modal-dialog {
  margin-top: 5%;
  margin-left: 25.8%;
}
.modal {
  color: var(--darker);
}
</style>
