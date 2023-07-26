import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'Inicio',
        icon: 'bx-home-circle',
        link: '/dashboard',

    },

    {
        id: 3,
        label: 'Modulos',
        isTitle: true
    },
    {
        id: 4,
        label: 'Tipos de Vehículos',
        icon: 'mdi mdi-car',
        subItems: [
            {
              id: 4,
              label: "Listar",
              link: "/vehiculos/listar",
              parentId: 5,
            },
      
          ],
    },
];

