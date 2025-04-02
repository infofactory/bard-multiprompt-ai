<?php

namespace Infofactory\BardMultipromptAi\Services;

class TemplateService
{
    public static function extractVariables(string $template): array
    {
        preg_match_all('/:([a-zA-Z0-9_]+)/', $template, $matches);
        return array_unique($matches[1]);
    }

    public static function renderTemplate(string $template, array $variables): string
    {
        return preg_replace_callback(
            '/:([a-zA-Z0-9_]+)/',
            function ($matches) use ($variables) {
                $varName = $matches[1];
                return $variables[$varName] ?? ':' . $varName; // Keep original if not found
            },
            $template
        );
    }
}