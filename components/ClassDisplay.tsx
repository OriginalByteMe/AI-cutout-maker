import { Badge, Paper, Grid, Title } from '@mantine/core';

interface ClassDisplayProps {
  classes: string | string[];
}

const colors = ['blue', 'red', 'green', 'yellow', 'cyan', 'purple', 'orange'];

const ClassDisplay: React.FC<ClassDisplayProps> = ({ classes }) => {
  const classArray = Array.isArray(classes) ? classes : [classes];

  return (
    <div className='flex flex-col items-center justify-center gap-3 pb-10'>
      <Title size="h2">The classes the AI used!</Title>
      <Paper className="p-4 border shadow h-max w-max">
        <Grid gutter="md" justify="center" align="center" grow>
          {classArray.map((cls, index) => (
            <Grid.Col span={{ base: 6, sm: 6, lg: 4 }} key={cls} className="flex items-center justify-center">
              <Badge color={colors[index % colors.length]} >{cls}</Badge>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

export default ClassDisplay;