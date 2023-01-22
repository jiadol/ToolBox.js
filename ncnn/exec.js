import path from 'path-browserify'


export default function runshell(formState) {
    const cmdpath = path.resolve();
    const cmd = cmdpath + "\\ncnn\\waifu2x-ncnn-vulkan.exe " + "-i " + formState.inputPath + " -o " + formState.outputPath + "\\output.png" + " -n " + formState.denoise + " -s " + formState.upscale
    return cmd
}