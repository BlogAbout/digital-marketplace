import { Tabs, Tab, Box } from '@mui/material';
import {AnimatePresence, motion} from 'framer-motion';
import {type ReactNode, useState } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {value === index && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AnimatedTabsProps {
  tabs: Array<{ label: string; content: ReactNode }>;
}

export default function AnimatedTabs({ tabs }: AnimatedTabsProps) {
  const [value, setValue] = useState(0);

  return (
    <Box>
      <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}
