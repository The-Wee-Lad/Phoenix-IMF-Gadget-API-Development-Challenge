import { Router } from 'express';

const router = Router();

import {
  getGadgets,
  addNewGadget,
  updateGadget,
  decommissionGadget,
  selfDestructSequence,
  requestSelfDestructSequence,
} from '../controllers/gadget.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

router.use(verifyToken);

router
  .route('/')
  .get(getGadgets)
  .post(addNewGadget)
  .patch(updateGadget)
  .delete(decommissionGadget);

router.route('/:id/self-destruct').post(selfDestructSequence);

router.route('/:id/request-self-destruct').post(requestSelfDestructSequence);

export { router as gadgetRouter };
