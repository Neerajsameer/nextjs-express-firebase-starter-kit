import { Express } from "express";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";
import errorHandler, { ERROR_CODES } from "../../../helpers/errorHandler";

const ROUTE_PROJECT = "/projects/:id";

export default function (app: Express) {
  app.get(ROUTE_PROJECT, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const { id } = req.params;

      const project = await prisma.projects.findUnique({ where: { id } });
      if (!project) throw errorHandler(ERROR_CODES.RECORD_NOT_FOUND, "Project not found");

      return { responseData: project };
    });
  });

  app.put(ROUTE_PROJECT, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const { id } = req.params;
      const {
        name,
        description,
        start_date,
        completion_date,
        state,
        bid_date,
        award_date,
        ntp_date,
        psc_preparation_date,
      } = req.body;

      const project = await prisma.projects.findUnique({ where: { id } });
      if (!project) throw errorHandler(ERROR_CODES.RECORD_NOT_FOUND, "Project not found");

      const updatedProject = await prisma.projects.update({
        where: { id },
        data: {
          name,
          description,
          start_date,
          completion_date,
          organisation_id: req.organisation_id,

          bid_date,
          award_date,
          ntp_date,
          psc_preparation_date,
        },
      });

      return { responseData: { data: updatedProject } };
    });
  });

  app.delete(ROUTE_PROJECT, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const { id } = req.params;

      const project = await prisma.projects.findUnique({ where: { id } });
      if (!project) throw errorHandler(ERROR_CODES.RECORD_NOT_FOUND, "Project not found");

      await prisma.projects.delete({ where: { id } });

      return { responseData: { message: "Project deleted successfully" } };
    });
  });
}
