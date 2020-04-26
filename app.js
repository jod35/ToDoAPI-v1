import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';
import todos from './db/db';




const app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//get all todos
app.get('/api/v1/todos',(req,res)=>{
    res.status(200).send(
        {
            success:true,
            message:"todos retrieved successfully",
            todos:db
        }
    )
});

//post a todo

app.post('/api/v1/todos/',(req,res)=>{
    if(!req.body.title){
        res.status(400).send({
            success:false,
            message:"title is required",

        });
    }

    else if(!req.body.description){
       res.status(400).send(
           {
               success:false,
               message:"description is required"
           }
       )
    }


    const todo={
        id :db.length +1,
        title:req.body.title,
        description:req.body.description
    }

    db.push(todo);

    return res.status(200).send({
        success:true,
        message:"todo added successfully",
        todo
    })
});


//get a single todo

app.get('/api/v1/todos/:id',(req,res)=>{
    const id = parseInt(req.params.id);
     
    //look for a todo with an id corresponding to that in the url
    db.map(
        (todo)=>{
            if(todo.id===id){
                res.status(200).send({
                    success:true,
                    message:"todo retrived successfully",
                    todo
                });
            }
        }
    );

    res.status(404).send({
        success:false,
        message:"Todo doesnot exist"
    });
}); 


//delete a todo.
app.delete('/api/v1/todos/:id',(req,res)=>{
    const id =parseInt(req.params.id);

    db.map((todo,index)=>{
        if(todo.id===id){
            db.splice(index,1);
            res.status(200).send({
                success:true,
                message:"todo deleted successfully"
                ,todo
            });
        }

    });

    res.status(404).send(
      {
          success:false,
          message:"todo not found",
      }
    );
    
});


//updating a todo

app.put('/api/v1/todos/:id',(req,res)=>{

    const id =parseInt(req.params.id);

    let found_todo;

    let itemIndex;

    //find a todo with a given id

    db.map(
        (todo,index)=>{
            if (todo ===id){
               found_todo=todo;
               itemIndex=index;
            }
        }
    );

    if (!found_todo){
        res.status(400).send(
            {
                success:false,
                message:"todo not found"
            }
        )
    }

    //validate this req data

    if(!req.body.title){
        res.status(400).send(
          {
              success:false,
              message:"title is required"
          }
        );
    }

    else if (!req.body.title){
        res.status(400).send(
            {
                success:false,
                message:"description is required"
            }
        );
    }

    const updated_todo={
        id:found_todo.id,
        title:req.body.title||found_todo.title,
        description:req.body.description||found_todo.description
    }

    db.splice(itemIndex,1,updated_todo);

    return res.status(201).send(
        {
            success:true,
            message:"to do updated successfully",
            updated_todo
        }
    ); 
});

const port = 5000;

app.listen(port,()=>{
    console.log(`Server listening on ${port}`);
});