var subredditlist = new Vue({
  el: "#subredditlist",
  data: {
    visible: true,
    subs: [
      { name: "pics" },
      { name: "wholesomememes" },
      { name: "adviceanimals" }
    ]
  }
});

var picturelist = new Vue({
  el: "#picturelist",
  data: {
    pictures: [],
    index: 0,
    interval: null,
    visible: false
  },
  methods: {
    run: function () {
      this.interval = setInterval(this.next, 7000);
      this.visible = true;
    },
    stop: function () {
      clearInterval(this.interval);
      this.pictures = [];
      this.visible = false;
    },
    next: function () {
      this.index += 1;
    }
  },
  computed: {
    currentPicture: function () {
      return this.pictures[this.index % this.pictures.length] || { link: "", title: "" };
    }
  }
});

var inputfield = new Vue({
  el: "#inputfield",
  data: {
    launchable: true,
    subinput: "",
    startbutton: "Start"
  },
  methods: {
    addsub: function () {
      if (this.subinput) {
        subredditlist.subs.push({ name: this.subinput });
        this.launchable = true;
      }
      this.subinput = "";
    },
    clearsubs: function () {
      subredditlist.subs = [];
      this.launchable = false;
    },
    getdata: function () {
      if (this.startbutton === "Start") {
        {
          subredditlist.subs.forEach(function (sub) {
            reddit.hot(sub.name).limit(100).fetch(function (res) {
              res.data.children.forEach(function (child) {
                if (child.data.url && child.data.url.endsWith(".jpg")) {
                  picturelist.pictures.push({ link: child.data.url, title: child.data.title || "" })
                  picturelist.pictureCount += 1;
                }
              })
            });
          });
          subredditlist.visible = false;
          inputfield.startbutton = "Stop";
          picturelist.run();
        }
      } else {
        subredditlist.visible = true;
        inputfield.startbutton = "Start";
        picturelist.stop();
      }
    }
  }
});