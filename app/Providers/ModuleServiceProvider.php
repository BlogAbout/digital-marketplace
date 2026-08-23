<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->registerModules();
    }

    public function boot(): void
    {
        $this->bootModules();
    }

    protected function registerModules(): void
    {
        $modules = config('modules.modules', []);

        foreach ($modules as $module) {
            $this->registerModuleConfig($module);
        }
    }

    protected function bootModules(): void
    {
        $modules = config('modules.modules', []);

        foreach ($modules as $module) {
            $this->bootModuleRoutes($module);
            $this->bootModuleMigrations($module);
            $this->bootModuleViews($module);
            $this->bootModuleTranslations($module);
        }
    }

    protected function registerModuleConfig(string $module): void
    {
        $configPath = $this->getModulePath($module) . '/config';

        if (File::isDirectory($configPath)) {
            foreach (File::files($configPath) as $file) {
                $configName = $file->getFilenameWithoutExtension();
                $this->mergeConfigFrom($file->getPathname(), $configName);
            }
        }
    }

    protected function bootModuleRoutes(string $module): void
    {
        $routesPath = $this->getModulePath($module) . '/routes';

        if (File::isDirectory($routesPath)) {
            foreach (File::files($routesPath) as $file) {
                $routeType = $file->getFilenameWithoutExtension();
                $middleware = $this->getRouteMiddleware($routeType);

                Route::middleware($middleware)
                    ->prefix($this->getRoutePrefix($routeType))
                    ->group($file->getPathname());
            }
        }
    }

    protected function bootModuleMigrations(string $module): void
    {
        $migrationsPath = $this->getModulePath($module) . '/Database/Migrations';

        if (File::isDirectory($migrationsPath)) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }

    protected function bootModuleViews(string $module): void
    {
        $viewsPath = $this->getModulePath($module) . '/Resources/views';

        if (File::isDirectory($viewsPath)) {
            $this->loadViewsFrom($viewsPath, strtolower($module));
        }
    }

    protected function bootModuleTranslations(string $module): void
    {
        $translationsPath = $this->getModulePath($module) . '/Resources/lang';

        if (File::isDirectory($translationsPath)) {
            $this->loadTranslationsFrom($translationsPath, strtolower($module));
        }
    }

    protected function getModulePath(string $module): string
    {
        return config('modules.path') . '/' . $module;
    }

    protected function getRouteMiddleware(string $type): array
    {
        return match ($type) {
            'api' => ['api', 'auth:sanctum'],
            'web' => ['web', 'auth'],
            'public' => ['api'],
            default => ['api'],
        };
    }

    protected function getRoutePrefix(string $type): string
    {
        return match ($type) {
            'api' => 'api',
            'web' => '',
            'public' => 'api/public',
            default => '',
        };
    }
}
