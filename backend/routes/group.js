const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

router.post('/create', async (req, res) => {
  const { name } = req.body;
  
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const userId = verifyToken(token);
  if (!userId) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  if (!name || !userId) {
    return res.status(400).json({ message: 'Group name and userId are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId provided' });
  }

  try {
    console.log('Attempting to create group:', name, userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) return res.status(400).json({ message: 'Group already exists' });

    const newGroup = new Group({
      name,
      members: [userId],
    });

    console.log('Saving new group...');
    await newGroup.save();
    console.log('Group saved successfully:', newGroup);

    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Error creating group', error });
  }
});

router.post('/join', auth, async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Nieprawidłowe ID grupy.' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Grupa nie została znaleziona.' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'Jesteś już członkiem tej grupy.' });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: 'Dołączono do grupy!' });
  } catch (error) {
    console.error('Błąd podczas dołączania do grupy:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

router.get('/:groupId', async (req, res) => {
  const { groupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ message: 'Invalid groupId provided' });
  }

  try {
    const group = await Group.findById(groupId).populate('members', 'email username');
    if (!group) return res.status(404).json({ message: 'Group not found' });

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Error fetching group', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('members', 'email username');
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups', error });
  }
});

router.post('/leave', async (req, res) => {
  const { groupId, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid groupId or userId provided' });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const index = group.members.indexOf(userId);
    if (index === -1) return res.status(400).json({ message: 'User not a member of this group' });

    group.members.splice(index, 1);
    await group.save();
    res.status(200).json({ message: 'User removed from group', group });
  } catch (error) {
    console.error('Error removing user from group:', error);
    res.status(500).json({ message: 'Error removing user from group', error });
  }
});

module.exports = router;
