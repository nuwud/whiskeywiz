import React, { useState, useEffect, useMemo } from 'react';
import { quarterService } from '../../services/quarterService';
import { Quarter, Sample } from '../../models/Quarter';
import { useAuth } from '../../contexts/AuthContext';

// ... copying content from repository GameContainer.tsx