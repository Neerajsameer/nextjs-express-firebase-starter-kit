import { Express } from "express";
import { responseWrapper } from "../../../helpers/responseWrapper";
import prisma from "../../../helpers/globals";

const ROUTE_PROJECTS = "/projects";

export default function (app: Express) {
  app.post(ROUTE_PROJECTS, async (req, res) => {
    return await responseWrapper(req, res, async () => {
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

      const project = await prisma.projects.create({
        data: {
          name,
          description,
          user_id: req.user_id,
          organisation_id: req.organisation_id,
          start_date,
          completion_date,

          bid_date,
          award_date,
          ntp_date,
          psc_preparation_date,
        },
      });

      return { responseData: { data: project } };
    });
  });

  app.get(ROUTE_PROJECTS, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const projects = await prisma.projects.findMany({ where: { organisation_id: req.organisation_id } });

      return { responseData: projects };
    });
  });
}
