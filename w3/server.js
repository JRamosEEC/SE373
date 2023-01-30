const express = require('express');
const hbs = require('hbs');

var app = express();

app.set('view engine', 'hbs');
hbs.registerPartials('/views/partials');
app.use(express.static('/public'));
app.use(express.urlencoded({extended:false}));

hbs.registerHelper('selectList',(nums)=>{
    var msg = '';

    var numList = nums.split(',').map(Number);

    for(i in numList)
    {
        msg+=`<option value="${numList[i]}">${numList[i]}</option>`;
    }

    return new hbs.handlebars.SafeString(msg);
});

hbs.registerHelper('generateColorGrid',()=>{
    var msg = '';

    msg += "<table><tbody>"

    for(let i = 0; i < 9; i++)
    {
        if(i % 3 == 0) {
            msg += "<tr>"
        }

        //I used a different generator because I was getting 5 hex color codes sometimes with the original and they obv couldn't work as a color
        let color = Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, "0");

        msg += `<td style="background-color: #${color};">${color}<br /><span style="color: #ffffff;">${color}</span></td>`;

        if(i+1 % 3 == 0) {
            msg += "</tr>"
        }        
    }

    msg += "</tbody></table>"

    return new hbs.handlebars.SafeString(msg);
});

hbs.registerHelper('404Msg',()=>{
    var msg = '';

    msg += "<h1>Not Found</h1>";

    var i = Math.floor((Math.random() * (50 - 20)) + 20);

    for(x = 0; x < i; x++)
    {
        var randomClass = Math.floor((Math.random() * 3));
        var className = "still";

        if (randomClass == 1) {
            className = "rotate";
        } else if (randomClass == 2) {
            className = "shrink";
        } else {
            className = "still";
        }

        msg += "<div class='" + className + "'>404</div>";
    }

    return new hbs.handlebars.SafeString(msg);
});

app.get('/NodeClass/w3/',(req, res)=>{
    res.render('form.hbs');
})

app.post('/NodeClass/w3/results',(req,res)=>{
    res.render('results.hbs',{
        numberFromForm:req.body.numPicker
    })
})

app.use((req, res, next)=>{
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.render('error.hbs', {
        message:`${error.status} ${error.message}`,
    });
})

app.get('/NodeClass/*',(req, res)=>{
    res.render('error.hbs');
})

app.listen(3009, ()=>{
    console.log('Server is running on Port 3009');
})

