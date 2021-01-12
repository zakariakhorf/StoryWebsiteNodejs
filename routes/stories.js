const express = require('express')
const router = express.Router()
const {ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')


// description Show add page GET STORIES/ADD

router.get('/add',ensureAuth, (req,res)=>{
    res.render('stories/add');
})
router.post('/',ensureAuth, async (req,res)=>{
    try{
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('dashboard')

    }catch(err){
        console.log(err)
        res.render('error/500')
    }
})


// Get all stories
router.get('/',ensureAuth, async (req,res)=>{
   try {
       const stories = await Story.find({status:'public'})
                     .populate('user')
                     .sort({createdAt:'desc'}).lean()

       res.render('stories/index',{stories})
   } catch (error) {
       console.log(error)
       res.render('error/500')
   }
})

// Get one story
router.get('/:id',ensureAuth, async (req,res)=>{
   try {
       let story =  await Story.findById(req.params.id)
                     .populate('user')
                     .lean()
     if (!story) {
       return res.render('error/404')
    } 
       res.render('stories/show',{story})
   } catch (error) {
       console.log(error)
       res.render('error/404')
   }
})






// show edit page
router.get('/edit/:id',ensureAuth, async (req,res)=>{
   const story = await Story.findOne({_id: req.params.id}).lean()
if(!story){
    return res.render('error/404')
}
if(story.user != req.user.id){
    res.redirect('/stories')
}else{
    res.render('stories/edit',{story});
}

    
})

// Update story PUT /stories/:id

router.put('/:id',ensureAuth,async (req,res)=>{
try {

let story = await Story.findById(req.params.id).lean()

if(!story){
    return res.render('error/404')
}
if(story.user != req.user.id){
    res.redirect('/stories')
}else{
   story = await Story.findOneAndUpdate( {_id : req.params.id },req.body,{new:true , runValidators:true})
   res.redirect('/stories')
}
} catch (error) {
        console.error(error)
        return res.render('error/500')
    
    



}})

// DELETE Story
//route DELETE /stories/


router.delete('/:id',ensureAuth, async(req,res)=>{
    try {
        await Story.remove({_id:req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
    
})



router.get('/user/:userId',ensureAuth,async (req,res)=>{
   try {
       const stories = await Story.find({user : req.params.userId , status:'public'}).populate('user').lean()
       res.render('stories/index',{stories})
   } catch (error) {
       console.error(error)
       res.render('error/500')
   }
})

module.exports = router ;