<template>
  <div>
    <h1>{{ mensaje }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mensaje: 'Cargando...'
    };
  },
  async mounted() {
    const res = await fetch('http://localhost:3000/api/hello');
    const data = await res.json();
    this.mensaje = data.message;
  }
};
</script>
