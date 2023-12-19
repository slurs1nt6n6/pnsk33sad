let eventBus = new Vue()

Vue.component('cards-kanban', {
    template:`
    <div>
        <fill></fill>
        <div id="columns">
            <column1 :column1="column1"></column1>
            <column2 :column2="column2"></column2>
            <column3 :column3="column3"></column3>
            <column4 :column4="column4"></column4>
        </div>
    </div>
    `,
    data() {
        return {
            column1:[],
            column2:[],
            column3:[],
            column4:[],
            showCard: true,
        }
    },
    methods:{

    },
    mounted() {
        eventBus.$on('card-create', card => {
            this.column1.push(card)
        })
        eventBus.$on('moving1', card => {
            this.column2.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)

        })
        eventBus.$on('moving2', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        })

        eventBus.$on('moving3-2', card => {
            this.column2.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateE = new Date().toLocaleDateString()
        })

        eventBus.$on('moving3-4', card => {
            this.column4.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateE = new Date().toLocaleDateString()
            card.dateE = card.dateE.split('.').reverse().join('-')
            console.log(card)
            if (card.dateE > card.dateD){
                card.inTime = false
            }
        })
    }
})

Vue.component('fill', {
    template:`
    <div>
    <div>
        <button v-if="!show" @click="openModal">Добавьте задачу</button>
        <div id="form" v-if="show" class="modal-shadow">
            <div class="modal">
                <div class="modal-close" @click="closeModal">&#10006;</div>
                <h3>Заполните карточку задачи</h3>
                <form @submit.prevent="onSubmit">
                    <p class="pForm">Введите заголовок: 
                        <input required type="text" v-model="title" maxlength="30" placeholder="Заголовок">
                    </p>
                    <p class="pForm">Добавьте описание задаче:</p>
                    <textarea v-model="description" cols="40" rows="4"></textarea>
                    <p class="pForm">Укажите срок выполнения задачи: 
                        <input required type="date" v-model="dateD">
                    </p>
                    <p class="pForm">
                        <input class="button" type="submit" value="Добавить задачу">
                    </p>
                </form>
            </div>
        </div>    
    </div>
    `,
    data(){
        return {
            title: null,
            description: null,
            dateD: null,
            show: false
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                dateD: this.dateD,                  //DateDEADLINE
                dateC: new Date().toLocaleString(),   //DataCreate
                updateCard: false,
                dateL: null,                            //DateLAST
                dateE: null,                            //DataEND
                inTime: true,                            //IN TIME
                reason: []
            }
            eventBus.$emit('card-create', card)
            this.title = null
            this.description = null
            this.dateD = null
            this.closeModal()
            console.log(card)
        },
        closeModal(){
            this.show = false
        },
        openModal(){
            this.show = true
        }
    }
})

let app = new Vue({
    el:'#app',
    data:{

    }
})