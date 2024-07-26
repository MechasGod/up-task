import { Router } from "express"
import { ProjectController } from '../controllers/ProjectController';
import { body, param } from "express-validator"
import { handleErrors } from '../middlewares/validation';
import { TaskController } from '../controllers/TaskController';
import { ValidateProjectExists } from '../middlewares/project';
import { ValidateTaskExists } from '../middlewares/task';
import { authenticate } from '../middlewares/jwtAuth';
import { TeamController } from '../controllers/TeamController';

const router = Router()

router.post("/",
  authenticate,
  body("projectName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
  body("clientName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
  body("description").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
  handleErrors,
  ProjectController.createProject )

router.get("/", authenticate, ProjectController.getAllProjects)

router.get("/:id",
  authenticate, 
  param("id").isMongoId().withMessage("Id no valida"), 
  handleErrors,
  ProjectController.getProjectById )

router.put("/:id", 
  authenticate,
  body("projectName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
  body("clientName").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
  body("description").notEmpty().withMessage("El nombre del proyecto es obligatorio"),
  param("id").isMongoId().withMessage("Id no valido"),
  handleErrors,
  ProjectController.updateProject
)

router.delete("/:id",
  authenticate,
  param("id").isMongoId().withMessage("Id no valido"),
  handleErrors,
  ProjectController.deleteProject
 )


//task routes

router.param("projectId", ValidateProjectExists) //lo que hace es verificar que todas las rutas que usen el parametro
//de url projectId, pasen por el middleware antes

router.post("/:projectId/tasks", 
  body("name").notEmpty().withMessage("El nombre no debe estar vacio"),
  body("description").notEmpty().withMessage("La descripción no debe estar vacia"),
  handleErrors,
  //ValidateProjectExists,
  TaskController.createTask )

//get project tasks

router.get("/:projectId/tasks",
  // ValidateProjectExists,
  TaskController.getTasks
 )


router.get("/:projectId/tasks/:id",
  // ValidateProjectExists,
  param("id").isMongoId().withMessage("Id no valido"),
  ValidateTaskExists,
  TaskController.getTaskById
 )

router.put("/:projectId/tasks/:id",
  param("id").isMongoId().withMessage("Id no valido"),
  ValidateTaskExists,
  TaskController.updateTask
)

router.patch("/:projectId/tasks/:id",
  param("id").isMongoId().withMessage("Id no valido"),
  ValidateTaskExists,
  TaskController.updateTaskState
)

router.delete("/:projectId/tasks/:id",
  param("id").isMongoId().withMessage("Id no valido"),
  ValidateTaskExists,
  TaskController.deleteTask
)

//teams

router.get("/:projectId/team",
  authenticate,
  handleErrors,
  TeamController.getProjectMembers
 )

router.get("/:projectId/team/:email",
  authenticate,
  param("email").notEmpty().withMessage("Email requerido").isEmail().withMessage("Email no valido").toLowerCase(),
  handleErrors,
  TeamController.findMemberByEmail
)

router.post("/:projectId/team",
  authenticate,
  body("id").isMongoId().withMessage("Id no valido").notEmpty().withMessage("Id requerido"),
  handleErrors,
  TeamController.addMemberById
 )

router.delete("/:projectId/team/:id", 
  authenticate,
  param("id").isMongoId().withMessage("Id no valido").notEmpty().withMessage("Id requerido"),
  handleErrors,
  TeamController.deleteMemberById
 )

export default router 