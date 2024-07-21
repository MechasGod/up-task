import { Task } from '@/types/index';
import { TaskCard } from './TaskCard';


interface Props {
  tasks: Task[]
}

const initialStatusGroups = {
  pending: [],
  onHold: [],
  inProgress: [],
  undeReview: [],
  completed: []
}

const statusStyles: { [key: string]: string }  = {
  pending: "border-t-slate-400",
  onHold: "border-t-red-400",
  inProgress: "border-t-blue-400",
  undeReview: "border-t-amber-400",
  completed: "border-t-emerald-400"
}

//Este tipo de tipado se utiliza cuando el objeto puede tener indefinidaes llaves que son string
export const statusTranslations: { [key: string]: string } = { 
  pending: "Pendiente",
  onHold: "En espera",
  inProgress: "En progreso",
  undeReview: "Bajo revisión",
  completed: "Completado"
}

export const TaskList = ({ tasks }: Props) => {

  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task]
    return { ...acc, [task.status]: currentGroup };   
  }, initialStatusGroups);

  

  return (
    <div>
      <h2 className="text-5xl font-black my-10">Tareas</h2>
      
      <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
          {Object.entries(groupedTasks).map(([status, tasks]) => ( //uso interesante del Object.entires y .map
              <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>

                  <h3 
                    className={`capitalize p-3 text-xl font-light border border-slate-300 ${statusStyles[status]} bg-white border-t-8`}
                    >{statusTranslations[status]}</h3>

                  <ul className='mt-5 space-y-5'>
                      {tasks.length === 0 ? (
                          <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                      ) : (
                          tasks.map((task: Task) => <TaskCard key={task._id} task={task} />)
                      )}
                  </ul>
              </div>
          ))}
      </div>
    </div>
  )
}
