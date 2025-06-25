module.exports = class Persona {

    constructor(nombre, apellido, genero, fechaNacimiento) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.genero = genero;
        this.fechaNacimiento = fechaNacimiento
    }

    nombreCompleto() {
        return this.nombre + ' ' + this.apellido;
    }

    getEdad() {
        // Obtener el dia de hoy

        // Restar el dia de hoy con su fecha de nacimiento

        // Convertir esos dias en ańos

        return 30;
    }

    static getGeneros() {
        return ['Masculino', 'Femenimo', 'Otros'];
    }

    static tiposDeDocumento() {
        return ['DNI', 'CE', 'PAS'];
    }

}