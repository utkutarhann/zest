import { motion } from 'framer-motion';
import { scenarios, type ScenarioId } from '../../data/scenarios';
import { useLanguage } from '../../context/LanguageContext';

interface ScenarioSelectorProps {
    selectedScenario: ScenarioId | null;
    onSelect: (scenario: ScenarioId) => void;
}

export function ScenarioSelector({ selectedScenario, onSelect }: ScenarioSelectorProps) {
    const { t } = useLanguage();

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('create.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.map((scenario) => {
                    const Icon = scenario.icon;
                    const isSelected = selectedScenario === scenario.id;

                    return (
                        <motion.button
                            key={scenario.id}
                            onClick={() => onSelect(scenario.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                relative p-6 rounded-3xl border-2 text-left transition-all duration-300 overflow-hidden group
                ${isSelected
                                    ? 'border-primary bg-primary/10 shadow-xl shadow-primary/30 scale-[1.02] ring-2 ring-primary ring-offset-2 ring-offset-background'
                                    : 'border-white/10 bg-surface hover:border-primary/50 hover:bg-white/5 hover:shadow-lg hover:shadow-primary/10'
                                }
              `}
                        >
                            <div className={`
                absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${scenario.color} 
                opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 
                group-hover:scale-110 transition-transform duration-500
              `} />

                            <div className="relative z-10 flex items-start space-x-4">
                                <div className={`
                  p-3 rounded-2xl bg-gradient-to-br ${scenario.color} text-white shadow-lg
                `}>
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text mb-1">{t(`create.scenario.${scenario.id}.title`)}</h3>
                                    <p className="text-sm text-text/60">{t(`create.scenario.${scenario.id}.desc`)}</p>
                                </div>
                            </div>

                            {isSelected && (
                                <motion.div
                                    layoutId="scenario-check"
                                    className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
