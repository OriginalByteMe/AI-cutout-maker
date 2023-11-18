import { Badge, Paper, Grid } from '@mantine/core';

interface ClassDisplayProps {
  classes: string[];
}

const colors = ['blue', 'red', 'green', 'yellow', 'cyan', 'purple', 'orange'];

const ClassDisplay: React.FC<ClassDisplayProps> = ({ classes }) => {
  return (
    <Paper className="p-4 border shadow h-max w-max">
      <Grid gutter="md" justify="center" align="center" grow>
        {classes.map((cls, index) => (
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} key={cls} className="flex items-center justify-normal">
            <Badge color={colors[index % colors.length]} >{cls}</Badge>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
};

export default ClassDisplay;