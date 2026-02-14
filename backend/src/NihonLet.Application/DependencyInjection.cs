using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NihonLet.Application.Common.Behaviors;

namespace NihonLet.Application;

/// <summary>
/// Extension methods để đăng ký các services của Application layer
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();
        
        // MediatR + Pipeline Behaviors
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(assembly));
        
        // LoggingBehavior: tự động ghi Audit Log + Application Log cho mọi Command/Query
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        
        // FluentValidation
        services.AddValidatorsFromAssembly(assembly);
        
        // AutoMapper - sẽ scan assembly để tìm Profile classes
        services.AddAutoMapper(cfg => { }, assembly);
        
        return services;
    }
}
