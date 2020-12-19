const express= require('express');
const hbs=require('hbs');
const bodyParser=require('body-parser');
const session = require('express-session');
const mysql= require('mysql');
const path = require('path');
const multer = require('multer');
const fs=require('fs');
const category_location_List = require('./utils/categories');

const conn = new mysql.createConnection(
    {
        host: 'localhost',
        user: 'hussain',
        password: '2010',
        database: 'classified-listing',
        multipleStatements: true
    } 
 );

conn.connect((err)=>{
    if(err)
    throw err;
    console.log('Database Connected');
});

const viewsPath=path.join(__dirname,'views');
const partialPath=path.join(__dirname,"partials");

hbs.registerPartials(partialPath);
hbs.registerHelper('loud', function(string) {
    return string.toUpperCase()
 });


const app = express();
app.set('views',path.join(viewsPath));
app.set('view engine','hbs');

app.use('/pictures',express.static(path.join(__dirname,'uploads')));
app.use('/assets',express.static(path.join(__dirname,'public')));
app.use('/node_modules/mdbootstrap',express.static(path.join(__dirname,'node_modules','mdbootstrap')));
app.use(session({secret:'secretKey',cookie:{maxAge:100000000}}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.get('/',(req,res)=>{
    const query=conn.query('select * from listing_location;select * from listing_categories',[1,2],(err,results)=>{
        if(err)
        throw err;
        category_location_List((result)=>{
        res.render('home',{
            location:results[0],
            category:results[1],
            title:'Classified Listing',
            headerOption:{
                catlist:result[0],
                loclist:result[1],
                login:req.session.loggedin,
                username:req.session.username,
                user_id:req.session.userid
              }
        });
    })
    })

});


app.get('/add-listing',(req,res)=>{
    if(req.session.loggedin)
    {
        const query=conn.query('select * from listing_location;select * from listing_categories',[1,2],(err,results)=>{
            if(err)
            throw err;

            category_location_List((result)=>{
                res.render('add-listing',{
                    location:results[0],
                    category:results[1],
                    headerOption:{
                    catlist:result[0],
                    loclist:result[1],
                    login:req.session.loggedin,
                    username:req.session.username,
                    user_id:req.session.userid
                  }
                });

            });

            
    
        })
        
    }
    else
    {
        res.redirect('/login?page=add-listing');
    }
});


app.get('/category',(req,res)=>{
    const query=conn.query("select * from listing_single_detail where category_id='"+req.query.id+"';select category_name from listing_categories where category_id='"+req.query.id+"'",[1,2],(err,results)=>{
        if(err)
        throw err;
       // console.log(results);
        category_location_List((result)=>{
        res.render('displayads',{
            result:results[0],
            category_title:results[1][0].category_name,
            headerOption:{
                catlist:result[0],
                loclist:result[1],
                login:req.session.loggedin,
                username:req.session.username,
                user_id:req.session.userid
              }
        });
    });
    })

});

app.get('/location',(req,res)=>{
    const query=conn.query("select * from listing_single_detail where location_id='"+req.query.id+"';select location_name from listing_location where location_id='"+req.query.id+"'",[1,2],(err,results)=>{
        if(err)
        throw err;
        // console.log(results);
        category_location_List((result)=>{
        res.render('displayads',{
            
            result:results[0],
            category_title:results[1][0].location_name,
            headerOption:{
                catlist:result[0],
                loclist:result[1],
                login:req.session.loggedin,
                username:req.session.username,
                user_id:req.session.userid
              }
        });
    });
    })

});

app.get('/all',(req,res)=>{
    const query=conn.query("select * from listing_single_detail",(err,results)=>{
        if(err)
        throw err;
       // console.log(results);
        category_location_List((result)=>{
        res.render('displayads',{
            result:results,
            category_title:"ALL",
            headerOption:{
                catlist:result[0],
                loclist:result[1],
                login:req.session.loggedin,
                username:req.session.username,
                user_id:req.session.userid
              }
        });
    });
    })

});

app.get('/search',(req,res)=>{
    category_location_List((result)=>{

        const sql="select * from listing_single_detail where listing_name like '%"+req.query.k+"%' and location_id='"+req.query.loc+"' and category_id='"+req.query.category+"' and listing_price>='"+req.query.min+"' and listing_price<='"+req.query.max+"'";
        conn.query(sql,(err,results)=>{
            if(err)
            throw err;
            // console.log(results);
            res.render('searchPage',{
                locationdrop:result[1],
                categorydrop:result[0],
                keyword:req.query.k,
                location:req.query.loc,
                category:req.query.category,
                min:req.query.min,
                max:req.query.max,
                results,results,
                headerOption:{
                    catlist:result[0],
                    loclist:result[1],
                    login:req.session.loggedin,
                    username:req.session.username,
                    user_id:req.session.userid
                  }
            });
        })
        
    });
})
app.get('/ad',(req,res)=>{
    const sql = "select * from listing_single_detail where listing_id='"+req.query.id+"'";
    conn.query(sql,(err,resu)=>{
// console.log(resu);        
        category_location_List((result)=>{
            res.render('singlead',{
                   
                results:resu,
                headerOption:{
                    catlist:result[0],
                    loclist:result[1],
                    login:req.session.loggedin,
                    username:req.session.username,
                    user_id:req.session.userid
                  }
            });
        });
    });
    
})

app.get('/profile',(req,res)=>{

    if(req.session.userid==req.query.id)
    {
        category_location_List((result)=>{

            const sql="select * from user where user_id='"+req.query.id+"'";
            conn.query(sql,(err,resu)=>{
                if(err)
                throw err;
                // console.log(resu);
                res.render('profileedit',{
                    results:resu,
                    headerOption:{
                        catlist:result[0],
                        loclist:result[1],
                        login:req.session.loggedin,
                        username:req.session.username,
                        user_id:req.session.userid
                      }
                });
            });
            
            
        });
    }
    else{
        category_location_List((result)=>{

            const sql="select * from user where user_id='"+req.query.id+"'";
            conn.query(sql,(err,resu)=>{
                if(err)
                throw err;
             //   console.log(resu);
                res.render('profile',{
                    results:resu,
                    headerOption:{
                        
                        catlist:result[0],
                        loclist:result[1],
                        login:req.session.loggedin,
                        username:req.session.username,
                        user_id:req.session.userid
                      }
                });
            });
            
            
        });
    }
    

});

app.get('/listings',(req,res)=>{
    if(req.session.loggedin){
        const sql="select * from listing_single_detail where user_id='"+req.session.userid+"'";
    conn.query(sql,(err,result)=>{
    res.render('listings',{
        headerOption:{
            login:req.session.loggedin,
            username:req.session.username,
            user_id:req.session.userid
          },
        results:result
    });

    })
    }
    else{
        res.redirect('/login')
    }
});

app.get('/login',(req,res)=>{
    req.session.page=req.query.page;;
    category_location_List((result)=>{
        res.render('login',{
            headerOption:{
                catlist:result[0],
                loclist:result[1],
                login:req.session.loggedin,
                username:req.session.username,
                user_id:req.session.userid
              }
        });
        
    });
    
})
app.get('/signup',(req,res)=>{
    category_location_List((result)=>{
        res.render('register',{
            headerOption:{
                catlist:result[0],
                loclist:result[1],
                login:req.session.loggedin,
                username:req.session.username,
                user_id:req.session.userid
              }
        });
        
    });
});

app.get('/logout',(req,res)=>{
    req.session.loggedin=false;
    res.redirect('/login');
})


app.post('/signup',(req,res)=>{
    const data={email:req.body.email,user_name:req.body.username,user_password:req.body.confirm_pass,type_id:2};
    const validation="select * from user where email='"+req.body.email+"' or user_name='"+req.body.user_name+"'";
    const query=conn.query(validation,(err,result)=>{
        if(err)
        throw err;
        else if(result.length!=0){
            res.render('register',{
                errorMessage:'Username Or Email Already Exists'
            });
        }
        else{
            const sql ='insert into user set ?';
    const query=conn.query(sql,data,(err,result)=>{
        if(err)
        throw err;
        console.log("Signup Success");
        res.redirect('back');
    });
        }
    })
});

app.post('/login',(req,res)=>{
    const sql="select * from user where (user_name='"+req.body.username_email+"' or email='"+req.body.username_email+"') and user_password='"+req.body.password+"'";
    conn.query(sql,(err,results)=>{
        if(err)
        throw err;
        else if(results.length!=0){
            req.session.loggedin=true;
            req.session.username=req.body.username_email;
            req.session.userid=results[0].user_id;
            if(!req.session.page)
            {
                res.redirect('/profile?id='+req.session.userid);
            }
            else
            res.redirect('/'+req.session.page);
        }
        else{
            res.render('login',{message:"Wrong Username or Password"})  
        }
    })
});


app.post('/listing',(req,res)=>{
if(req.session.loggedin==true)
{

    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
          //  console.log(req.session.userid);
            const userId= req.session.userid.toString();
            const dir = path.join(__dirname,'uploads',userId);
            fs.exists(dir, exist => {
            //console.log(dir);
            if (!exist) {
              return fs.mkdir(dir, error => callback(error, dir))
            }
            return callback(null, dir)
            })
        },
        filename: function (req, file, callback) {
            if(!req.headers.index)
            req.headers.index=0
            var filename = (req.headers.index++) + path.extname(file.originalname)
          callback(null, filename);
        }
    });
    
    const upload = multer({ storage : storage }).array('pictures',3);
    upload(req,res,function(err){
        if(err)
        throw err;
    
    const sql="insert into listings(category_id,location_id,listing_name,listing_desc,listing_price,listing_date,user_id) values('"+req.body.categories+"','"+req.body.location+"','"+req.body.title+"','"+req.body.description+"','"+req.body.price+"',curdate(),'"+req.session.userid+"')";
   // console.log(sql);
    const query = conn.query(sql,(err,results)=>{
        if(err)
        throw err;
     //   console.log(results);
       // console.log(req.files);
        const NewPathImage= path.join(__dirname,'uploads',(results.insertId.toString()),'/');
        fs.mkdirSync(NewPathImage, { recursive: true });
        for (const index in req.files){
         //   console.log(req.files[index].path);
            const NNewPathImage=path.join(NewPathImage,req.files[index].filename);
           // console.log(NNewPathImage);
            fs.renameSync(req.files[index].path, NNewPathImage, function (err) {
                if (err) {
                    throw err
                } else {
         //           console.log("Successfully moved the file!");
                }
            });
        }

    });

    
    
        res.redirect('back');
    });

    
}
});

app.post('/updateProfile',(req,res)=>{{

    const sql="update user set full_name='"+req.body.fullname+"',email='"+req.body.email+"',contact_number='"+req.body.contact+"',address='"+req.body.address+"' where user_id='"+req.session.userid
    +"'";
    conn.query(sql,(err,result)=>{
        if(err)
        throw err;
        res.redirect('back');
    })

}});
app.get('/deletelisting',(req,res)=>{
    const sql='delete from listings where listing_id="'+req.query.id+'"';
    conn.query(sql,(err,result)=>{
        if(err)
        throw err;
        res.redirect('back');
    })
});

app.listen('3000',()=>{
    console.log('App running on port 3000');
});
