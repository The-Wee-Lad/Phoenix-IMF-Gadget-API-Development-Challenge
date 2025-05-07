import { prismaClient } from '../db/index.js';
import { Gadget } from '../../generated/client/index.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';

import { Request, Response } from 'express';

import { generateName, generateOtp, generateNumber } from '../utils/index.js';

const getGadgets = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as
    | 'Available'
    | 'Deployed'
    | 'Destroyed'
    | 'Decommissioned'
    | undefined;

  const filter: any = {};
  if (
    status &&
    status in ['Available', 'Deployed', 'Destroyed', 'Decommissioned']
  )
    filter.status = status;
  const result: (Gadget & { probabilty?: string })[] =
    await prismaClient.gadget.findMany({ where: filter });
  result.forEach((element, index) => {
    element.probabilty = `${generateNumber()}% success probability`;
    result[index] = element;
  });
  res.status(200).json(new ApiResponse(200, 'Gadgets Fetched', result));
});

const addNewGadget = asyncHandler(async (req: Request, res: Response) => {
  const newGadget = await prismaClient.gadget.create({
    data: {
      name: generateName(),
    },
  });
  res
    .status(200)
    .json(new ApiResponse(200, 'New Gadget Added To the Inventory', newGadget));
});

const updateGadget = asyncHandler(async (req: Request, res: Response) => {
  let { gadgetId, name, status } = req.body;

  const gadget = await prismaClient.gadget.findUnique({
    where: { id: gadgetId },
  });
  if (!gadget) throw new ApiError(400, 'No such Gadget Exists', 'DB_004');

  name = name || gadget.name;
  if (
    !status ||
    !(['Available', 'Deployed', 'Destroyed', 'Decommissioned'].includes(status))
  )
    status = gadget.status;

  const updated = await prismaClient.gadget.update({
    data: {
      status: status,
      name: name,
    },
    where: {
      id: gadgetId,
    },
  });
  if (!updated) throw new ApiError(500, 'DB server error', updated);
  res.status(200).json(new ApiResponse(200, 'Gadget Updated', updated));
});

const decommissionGadget = asyncHandler(async (req: Request, res: Response) => {
  let gadgetId = req.body.gadgetId as string;
  const gadget = await prismaClient.gadget.findUnique({
    where: { id: gadgetId },
  });
  if (!gadget) throw new ApiError(400, 'No such Gadget Exists', 'DB_004');
  if (gadget.status === 'Decommissioned')
    throw new ApiError(409, 'Alredy Decommissioned', 'DB_009');

  const updated = await prismaClient.gadget.update({
    data: {
      status: 'Decommissioned',
      decommissonedAt: new Date(Date.now()),
    },
    where: {
      id: gadgetId,
    },
  });
  if (!updated) {
    throw new ApiError(500, "Couldn't Decommission", 'DB_003');
  }
  res.status(200).json(new ApiResponse(200, 'Decommissioned', updated));
});

const selfDestructSequence = asyncHandler(
  async (req: Request, res: Response) => {
    const confirmationCode = req.body.confirmationCode;
    const gadgetId = req.params.id;
    const gadget = await prismaClient.gadget.findUnique({
      where: { id: gadgetId },
    });
    if (!gadget) throw new ApiError(400, 'No such Gadget Exists', 'DB_004');
    if (gadget.confirmationCode != confirmationCode) {
      throw new ApiError(403, 'Wrong Confirmation Code', 'AUTH_004');
    }
    if (gadget.status === 'Decommissioned' || gadget.status === 'Destroyed') {
      throw new ApiError(409, 'Alredy Decommissioned or Destroyed', 'DB_009');
    }
    if (
      !gadget.confirmationCode ||
      !gadget.expiresAt ||
      gadget.expiresAt.getTime() < Date.now()
    ) {
      throw new ApiError(409, 'Already Expired!', 'AUTH_004');
    }

    //To self Destruct it in 10 seconds
    // setTimeout(() => {
    //   let destroyed = await prismaClient.gadgets.update({
    //     data: {
    //       status: "Destroyed"
    //     },
    //     where: {
    //       id: gadgetId
    //     }
    //   });
    // }, 10000);

    res
      .status(200)
      .json(
        new ApiResponse(200, 'The Gadget is going to be destroyed!!', gadget)
      );
  }
);

const requestSelfDestructSequence = asyncHandler(
  async (req: Request, res: Response) => {
    const gadgetId = req.params.id;
    const gadget = await prismaClient.gadget.findUnique({
      where: { id: gadgetId },
    });
    if (!gadget) throw new ApiError(400, 'No such Gadget Exists', 'DB_004');

    const code: number = generateOtp();
    const expiresAt: Date = new Date(Date.now() + +10 * 60 * 1000);

    const updated = await prismaClient.gadget.update({
      where: { id: gadgetId },
      data: {
        confirmationCode: code,
        expiresAt: expiresAt,
      },
    });
    // I would send the user using this endpoint an email with confimation code with Nodemailer
    // i sent updated in the response for testing only, it not good.
    res
      .status(200)
      .json(
        new ApiResponse(200, 'Confirmation Code sent to email!', { updated })
      );
  }
);

export {
  getGadgets,
  addNewGadget,
  updateGadget,
  decommissionGadget,
  selfDestructSequence,
  requestSelfDestructSequence,
};
