var help = {
    upperCase: function(aString) {
        return aString.toUpperCase()
    },
    upperCase: function(aString) {
        return aString.charAt(0).toUpperCase() + aString.slice(1);
    },
    incrementByOne: (data) => {
        return data + 1;
    },
    list: (data, options) => {
        var obj = [];
        for (var i = 0; i < data.length; i++) {
            if (i < 4) {
                console.log(i)
                obj.push(options.fn(data[i]));
            }
        }
        return obj
    },
    pagination: (count, options) => {
        var obj = []
        var page = 0
        for (var i = 0; i < count; i += 3) {
            page += 1
            obj.push("<li class='page-item'><a class='page-link' href='?page=" + page + "'>" + page + "</a></li>");
        }
        return obj
    }
}

module.exports = help;