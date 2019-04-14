export interface InputConfig {
    filetype: string;
    filetypeShort: string;
    errorMessage: string;
    fileName: string;
    defaultHint: string;
}

export const inputConfigs: InputConfig[] = [
    {
        filetype: 'image/svg+xml',
        filetypeShort: 'svg',
        errorMessage: '',
        fileName: '',
        defaultHint: 'SVG file (or chartaccent.svg)'
    },
    {
        filetype: 'application/json',
        filetypeShort: 'json',
        errorMessage: '',
        fileName: '',
        defaultHint: 'JSON file (or chartaccent.json)'
    }
]
