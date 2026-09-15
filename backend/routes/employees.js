import express from 'express';
import { Employees } from '../models/db.js';

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. GET ALL EMPLOYEES with filters (name, email, department, status, search)
router.get('/', async (req, res) => {
  try {
    const { name, email, department, dept, status, search } = req.query;
    const targetDept = department || dept;

    const allEmployees = await Employees.find({});

    const filtered = allEmployees.filter((emp) => {
      // Search filter (name, email, role)
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          emp.name?.toLowerCase().includes(q) ||
          emp.email?.toLowerCase().includes(q) ||
          emp.role?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Search by name
      if (name && name.trim()) {
        if (!emp.name?.toLowerCase().includes(name.trim().toLowerCase())) return false;
      }

      // Search by email
      if (email && email.trim()) {
        if (!emp.email?.toLowerCase().includes(email.trim().toLowerCase())) return false;
      }

      // Filter by department
      if (targetDept && targetDept !== 'All' && targetDept.trim()) {
        if (emp.dept?.toLowerCase() !== targetDept.trim().toLowerCase()) return false;
      }

      // Filter by status
      if (status && status !== 'All' && status.trim()) {
        if (emp.status?.toLowerCase() !== status.trim().toLowerCase()) return false;
      }

      return true;
    });

    return res.status(200).json({
      success: true,
      count: filtered.length,
      employees: filtered,
    });
  } catch (err) {
    console.error('Get employees error:', err);
    return res.status(500).json({ error: 'Internal server error fetching employees' });
  }
});

// 2. GET SINGLE EMPLOYEE by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employees.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.status(200).json({ success: true, employee });
  } catch (err) {
    console.error('Get single employee error:', err);
    return res.status(500).json({ error: 'Internal server error fetching employee' });
  }
});

// 3. CREATE EMPLOYEE
router.post('/', async (req, res) => {
  try {
    const { name, email, role, dept, status, color } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Employee name is required' });
    }
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'A valid employee email address is required' });
    }
    if (!role || typeof role !== 'string' || !role.trim()) {
      return res.status(400).json({ error: 'Job role is required' });
    }
    if (!dept || typeof dept !== 'string' || !dept.trim()) {
      return res.status(400).json({ error: 'Department is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate employee email
    const existing = await Employees.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ error: 'An employee with this email already exists' });
    }

    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newEmployee = await Employees.create({
      name: name.trim(),
      email: normalizedEmail,
      role: role.trim(),
      dept: dept.trim(),
      status: status || 'Active',
      initials,
      color: color || '#7c4dff',
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: newEmployee,
    });
  } catch (err) {
    console.error('Create employee error:', err);
    return res.status(500).json({ error: 'Internal server error creating employee' });
  }
});

// 4. UPDATE EMPLOYEE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employees.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const { name, email, role, dept, status, color } = req.body;

    // Check duplicate email if changed
    if (email && email.trim().toLowerCase() !== employee.email.toLowerCase()) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await Employees.findOne({ email: normalizedEmail });
      if (existing && existing.id !== id) {
        return res.status(400).json({ error: 'An employee with this email already exists' });
      }
    }

    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.initials = name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    if (email) updateData.email = email.trim().toLowerCase();
    if (role) updateData.role = role.trim();
    if (dept) updateData.dept = dept.trim();
    if (status) updateData.status = status.trim();
    if (color) updateData.color = color.trim();

    const updated = await Employees.findByIdAndUpdate(id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee: updated,
    });
  } catch (err) {
    console.error('Update employee error:', err);
    return res.status(500).json({ error: 'Internal server error updating employee' });
  }
});

// 5. DELETE EMPLOYEE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employees.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      deleted,
    });
  } catch (err) {
    console.error('Delete employee error:', err);
    return res.status(500).json({ error: 'Internal server error deleting employee' });
  }
});

export default router;
