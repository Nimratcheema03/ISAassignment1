const express = require('express');
const router = express.Router();
const {types} = require('./types')
const {populatePokemons} = require('./pokemon');
const { default: mongoose } = require('mongoose');
var pokemodel = null;

(async function () {
    const schema = await types();
    pokemodel = await populatePokemons(schema)
})();

//middleware to validate id
const validateId = (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }
  
    if (!Number.isInteger(+id)) {
      return res.status(400).json({errMsg: 'CastError: pokemon id must contain only digits'});
    }
  
    next();
  };

function validationData(err){
    if(err.code == 11000){
        return ({errMsg : "Duplicate pokemon"})
    }else if(err instanceof mongoose.Error.ValidationError){
        return ({errMsg : "ValidationError"})
    }else if(err instanceof mongoose.Error.CastError){
        return ({errMsg : "CastError"})
    }else{
        return ({errMsg: err})
    }
}
router.get('/pokemons', async(req, res)=>{
    const count = req.query.count || 10
    const after = req.query.after || 0
    try {
        const doc  = await pokemodel.find({}).sort({"id":1})
        .skip(after)
        .limit(count)
        res.json(doc)
    }catch(err){
        res.json(validationData(err))
    }
})
router.post('/pokemon',  async(req, res)=>{
    let newPokemon = req.body
    try{
       const pokemon = await pokemodel.create(newPokemon)
       if(pokemon){
        res.json({
            msg: "Added Successfully"
        })
        }else{
            res.json({
                errMsg: "Cannot create pokemon"
            })
        }
    }
    catch (err){
        res.json(validationData(err))
    }
})
router.get('/pokemon/:id',validateId, async(req, res)=>{
     try{
        const {id }= req.params
        const pokemon = await pokemodel.find({"id": id})
        if(pokemon.length != 0){
            res.json(pokemon)
        }
        else{
            res.json(
                {
                errMsg: "Pokemon not found"
                }
            )
        }
     }catch(err){
        res.json(validationData(err))
     }
})

router.put('/pokemon/:id', async(req, res)=>{
    try{
        const id = {id: req.params.id}
        const pokemon = await pokemodel.findOneAndUpdate(id, req.body,   { upsert: true, new: true})
        if(pokemon){
            res.json({
                msg : "Updated Successfully",
                pokeInfo : pokemon
            })
        }else{
            res.json({
                msg: "Not found"
            })
        }
    }catch (err){
        res.json(validationData(err))
    }
})

router.patch('/pokemon/:id', async(req, res)=>{
    try{
        const id = {id: req.params.id}
        const pokemon = await pokemodel.findOneAndUpdate(id, req.body,   { new: true})
        if(pokemon){
            res.json({
                msg : "Updated Successfully",
                pokeInfo : pokemon
            })
        }else{
            res.json({
                errMsg: "Pokemon not found"
            })
        }
    }catch (err){
        res.json(validationData(err))
    }
})

router.delete('/pokemon/:id', async(req, res)=>{
    try{
        const id = {id: req.params.id}
        const pokemon = await pokemodel.findOneAndRemove(id)
        if(pokemon){
            res.json({
                msg : "Deleted Successfully",
                pokeInfo : pokemon
            })
        }else{
            res.json({
                errMsg: "Pokemon not found"
            })
        }
    }catch(err){
      res.json(validationData(err))
    }
})
router.get('/pokemonImage/:id', async(req, res)=>{
    let id = req.params.id
    try{
        const pokemon = await pokemodel.findOne({"id": id})
        if(pokemon){
            let desiredLength = 3;
            let paddedNumber = id.toString().padStart(desiredLength, '0');
            const response  = `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${paddedNumber}.png`
            console.log(response)
            res.json(response)
        }else{
            res.json({
                msg : "Pokemon not found"
            })
        }
    }
    catch(err){
        res.json(validationData(err))
    }
})
module.exports = router