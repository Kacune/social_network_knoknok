var add_photo_form = new Vue({
    el: "#add_photo_form",
    data: {
        'form': {
            'user': 0,
            'paid': false,
            'cost': 0,
            'path_photo': '',
            'description': ''
        },
        'photo': '',
        'description': '',
        'cost': 0,
        'count_photo_paid' : 0,
        'selectedFile': ''
    },
    async created() {
        socket.on('add-photo', (data) => {
            photo_block.photos = [];
            photo_block.getPhotos();
        });
    },
    methods: {
        async getPhotos(event){
            var csrftoken = this.readCookie('csrftoken');
            ls = window.localStorage;
            const formData = new FormData();
            formData.append('path_photo', this.selectedFile, this.selectedFile.name);
            event.preventDefault();
            if (this.cost > 0){
                formData.append('paid', true);
            }
            else{
                formData.append('paid', false)
            }
            formData.append('user', ls.getItem('id'));
            formData.append('cost', this.cost);
            formData.append('description', this.description);
            axios({
                withCredentials: true,
                url: config.host +'/api/photos/create',
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem('access')
                },
                method: 'POST',
                data: formData
            })
            $('#upload_photo_img').css('display', 'none');
            $('.select_photo').text('Загрузить фото');
            console.log(this.count_photo_paid);
            this.selectedFile = '';
            this.cost = 0;
            this.description = null;
            socket.emit('add-photo', this.selectedFile.name);
        },
        editImage(event){
            this.selectedFile = event.target.files[0];
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    $('#upload_photo_img').attr('src', e.target.result);
                    $('#upload_photo_img').css('display', 'inline-block');
                    $('.select_photo').text('');
                }
                reader.readAsDataURL(event.target.files[0]);
            }
        },
        readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    }
})

var photo_block = new Vue({
    el: "#photo_block",
    data: {
        'photos': [],
        'count_photo_paid' : 0,
        'count_photo_free' : 0,
        'count_photo_all' : 0,

    },
    async created() {
        this.getPhotos();
        console.log(this.photos);
    },
    methods: {
        async getPhotos(){
            localStorage = window.localStorage;
            var photos = await fetch(config.host +'/api/photos/?user='+ localStorage.getItem('id'), {
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer '+localStorage.getItem('access')
                    },
                }
            );
            let photos_list = await photos.json();
            for(var i = 0; i < photos_list.length;i++){
                this.photos.push(photos_list[i]);
                if(photos_list[i].paid){
                    this.count_photo_paid++;
                }
            }
            add_photo_form.count_photo_paid = this.count_photo_paid;
            this.count_photo_all = this.photos.length;
            this.count_photo_free = this.count_photo_all - this.count_photo_paid;

        },
        open_slider(index){
            document.getElementById('photo_all_screen').style.display = 'flex';
            photo_all_screen.show_image_function(index);
        },
        pathPhoto(index){
            return `media/${this.photos[index].path_photo}`;
        },
        readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    }
})


//var add_photo_counters = new Vue({
//    el: "#add_photo_counters",
//    data: {
//        count_photo_free: 0,
//        count_photo_all: 0,
//        count_photo_paid: 0
//    },
//    async created() {
//        this.count_photo_free = photo_block.count_photo_free;
//        this.count_photo_all = photo_block.count_photo_all;
//        this.count_photo_paid = photo_block.count_photo_paid;
//    }
//})