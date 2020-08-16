import Event, { validateEvent } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';

const attributes = {
  validate: validateEvent,
};

/**
 * List of Events
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Event
 */
const list = async (req, res) => {
  const [error, events] = await wrapper(Event.find());
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ events });
};

/**
 * Finds one specific Event
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Event
 */
const findById = async (req, res) => {
  const [error, event] = await wrapper(Event.findById({ _id: req.params.id }));

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ event });
};

/**
 * Creates an Event
 * @param {Object} req
 * @param {Object} res
 * @returns The saved Event
 */
const create = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const event = new Event(value);
  const [errorSaving, savedEvent] = await wrapper(event.save());

  return errorSaving
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating the Event', error: errorSaving })
    : res.status(CREATED).send(savedEvent);
};

/**
 * Updates an Event
 * @param {Object} req
 * @param {Object} res
 * @returns The Event updated
 */
const update = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedEvent] = await wrapper(
    Event.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true }
    )
  );

  return errorUpdating
    ? res.status(INTERNAL_SERVER_ERROR).send('Error updating the Event')
    : res.status(CREATED).send(updatedEvent);
};

export { list, findById, create, update };
